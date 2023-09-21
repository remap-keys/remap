/* eslint-disable no-undef */
import {
  PDFDocument,
  rgb,
  PDFPage,
  PDFFont,
  degrees,
  Degrees,
  RGB,
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { KeyOp } from '../../gen/types/KeyboardDefinition';
import KeyboardModel from '../../models/KeyboardModel';
import KeyModel from '../../models/KeyModel';
import download from 'downloadjs';
import { buildHoldKeyLabel } from '../../components/configure/customkey/TabHoldTapKey';
import { buildModLabel } from '../../components/configure/customkey/Modifiers';
import { isDoubleWidthString } from '../../utils/StringUtils';
import { Key } from '../../components/configure/keycodekey/KeyGen';
import { KeyboardLabelLang, KeyLabelLangs } from '../labellang/KeyLabelLangs';
import { LayoutOption } from '../../components/configure/keymap/Keymap';

type KeymapType = ((string | KeyOp)[] | { name: string })[];
export class KeymapPdfGenerator {
  readonly black = rgb(0, 0, 0);
  readonly gray = rgb(0.3, 0.3, 0.3);
  readonly grayPale = rgb(0.5, 0.5, 0.5);
  readonly fontSizeNormal = 12;
  readonly fontSizeSmall = 10;

  readonly headerH = 24;
  readonly footerH = 24;
  readonly blank = 16; // empty space of left, right and bottom
  readonly keyboardMarginWidth = 16;
  readonly kbdR = 8;
  readonly contentTopMargin = 16;
  readonly layerHeaderHeight = 16;

  private model: KeyboardModel;
  private keys: { [pos: string]: Key }[];
  private layerCount: number;
  private doc: PDFDocument | null = null;
  private font: PDFFont | null = null;
  private alignLeft: number = 0;
  private alignTop: number = 0;
  private labelLang: KeyboardLabelLang;

  constructor(
    keymap: KeymapType,
    keys: { [pos: string]: Key }[],
    layerCount: number,
    labelLang: KeyboardLabelLang
  ) {
    this.model = new KeyboardModel(keymap);
    this.keys = keys;
    this.layerCount = this.getActiveLayerCount(layerCount);
    this.labelLang = labelLang;
  }

  /**
   * This function calculates the last layer number that does not contain meaningful keys after it.
   *
   * @param layerCount the number of layers
   * @returns the active layer number
   */
  getActiveLayerCount(layerCount: number): number {
    let lastActiveLayerCount = 0;
    for (let i = 0; i < layerCount; i++) {
      let hasLabel = false;
      Object.keys(this.keys[i]).forEach((pos) => {
        const key: Key = this.keys[i][pos];
        hasLabel = hasLabel || key.keymap.code != 0; // NOT NOOP
      });
      if (hasLabel) {
        lastActiveLayerCount = i;
      }
    }
    return lastActiveLayerCount + 1;
  }

  async genPdf(name: string, options?: LayoutOption[]) {
    const { keymaps, width, height, left, top } = this.model.getKeymap(options);
    const keyboardHeight = height + this.kbdR * 2;

    const url = '/assets/fonts/RictyDiminished-Regular.ttf';
    const fontBytes = await fetch(url).then((res) => res.arrayBuffer());
    const title = `${name} keymap's cheat sheet (${KeyLabelLangs.getLabelLangMenuLabel(
      this.labelLang
    )})`;
    this.doc = await PDFDocument.create();
    this.doc.setAuthor('Remap');
    this.doc.setCreationDate(new Date());
    this.doc.setKeywords(['keyboard', 'keymap', 'remap', 'cheatsheet']);
    this.doc.setSubject(title);
    this.doc.setTitle(title);
    this.doc.setLanguage(this.labelLang);
    this.doc.setProducer('Remap cheat sheet generator');
    this.doc.setCreator('Remap cheat sheet generator');
    this.doc.registerFontkit(fontkit);
    this.font = await this.doc.embedFont(fontBytes, { subset: true });
    this.alignLeft = left;
    this.alignTop = top;
    const W = width + (this.blank + this.keyboardMarginWidth + this.kbdR) * 2;
    const H =
      (this.contentTopMargin + this.layerHeaderHeight + keyboardHeight) *
        this.layerCount +
      this.blank +
      this.headerH +
      this.footerH;

    const page = this.doc.addPage([W, H]);

    // header
    this.drawHeader(page, title);

    // contents
    const contentX = this.blank + this.keyboardMarginWidth;
    const contentY = H - this.headerH;
    let y = contentY;
    for (let i = 0; i < this.layerCount; i++) {
      const keyboardContentHeight = keyboardHeight + this.layerHeaderHeight;
      y -= this.contentTopMargin;
      this.drawLayerContent(page, i, keymaps, contentX, y, width, height);
      y -= keyboardContentHeight;
    }

    // footer
    this.drawFooter(page, 'https://remap-keys.app');

    const pdfBytes = await this.doc.save();
    download(
      pdfBytes,
      `keymap_cheatsheet_${name.replace(/\s+/g, '_').toLocaleLowerCase()}.pdf`,
      'application/pdf'
    );
  }

  private drawLayerContent(
    page: PDFPage,
    layer: number,
    keymaps: KeyModel[],
    x: number,
    y: number,
    keyboardWidth: number,
    keyboardHeight: number
  ) {
    const layerHeaderY = y - this.layerHeaderHeight;
    page.drawText(`Layer ${layer}`, {
      x: x + this.kbdR,
      y: layerHeaderY + 4,
      size: this.fontSizeNormal,
      color: this.gray,
      font: this.font!,
    });
    this.drawLayer(
      page,
      keymaps,
      layer,
      x,
      layerHeaderY,
      keyboardWidth,
      keyboardHeight
    );
  }

  private drawLayer(
    page: PDFPage,
    keymaps: KeyModel[],
    layer: number,
    x: number,
    y: number,
    keyboardWidth: number,
    keyboardHeight: number
  ) {
    // keyboard frame
    const kbdW = keyboardWidth;
    const kbdH = keyboardHeight;
    const keyboardPath = `M${this.kbdR},0 h${kbdW} a${this.kbdR},${this.kbdR} 0 0 1 ${this.kbdR},${this.kbdR} v${kbdH} a${this.kbdR},${this.kbdR} 0 0 1 -${this.kbdR},${this.kbdR} h-${kbdW} a${this.kbdR},${this.kbdR} 0 0 1 -${this.kbdR},-${this.kbdR} v-${kbdH} a${this.kbdR},${this.kbdR} 0 0 1 ${this.kbdR},-${this.kbdR} Z`;
    page.drawSvgPath(keyboardPath, {
      x: x,
      y: y,
      borderColor: this.gray,
      borderWidth: 1,
    });

    // keycaps
    const keymapX = x + this.kbdR - this.alignLeft;
    const keymapY = y - this.kbdR + this.alignTop;
    keymaps.forEach((km: KeyModel) => {
      if (km.isDecal) return;

      const key: Key = this.keys[layer][km.pos];
      this.drawKeycap(page, key, km, keymapX, keymapY);
    });
  }

  private drawKeycap(
    page: PDFPage,
    key: Key,
    km: KeyModel,
    rootX: number,
    rootY: number
  ) {
    const box = 56;
    const margin = 2;
    const r = 4;

    const ccw = (x: '' | '-', y: '' | '-') => {
      return `a${r},${r} 0 0 0 ${x}${r} ${y}${r}`;
    };
    const cw = (x: '' | '-', y: '' | '-') => {
      return `a${r},${r} 0 0 1 ${x}${r},${y}${r}`;
    };
    const roofWidth = box * km.w - (r + margin) * 2;
    const roofHeight = box * km.h - (r + margin) * 2;
    let path = '';
    if (km.isIsoEnter) {
      /**
       *       lenW6 lenW0
       *         __ _______
       *       /            \
       * lenH5|             |
       *       \__          |
       *     lenW4\         | lenH1
       *          |         |
       *     lenH3|         |
       *           \_______/
       *            lenW2
       */
      const lenW0 = box * km.w - (r + margin) * 2;
      const lenH1 = box * km.h - (r + margin) * 2;
      const lenW2 = box * km.w - 2.5 * r - margin;
      const lenH3 = box * (km.h - km.h2) - 1.5 * r - margin;
      const lenW4 = box * (km.w2 - km.w) - 1.5 * r - margin;
      const lenH5 = box * km.h2 - 2.5 * r - margin;
      const lenW6 = box * (km.w2 - km.w);
      path = `M${margin + r},${margin} h${lenW0} ${cw('', '')} v${lenH1} ${cw(
        '-',
        ''
      )} h-${lenW2} ${cw('-', '-')} v-${lenH3} ${ccw('-', '-')} h-${lenW4} ${cw(
        '-',
        '-'
      )} v-${lenH5}, ${cw('', '-')} h${lenW6}`;
    } else if (km.isBackwardsEnter) {
      /**
       *         lenW6 lenW0
       *            __ ____
       *           /        \
       *     lenH5|         |
       *          |         |
       *     lenW4|         | lenH1
       *       /            |
       * lenH3|             |
       *       \____________/
       *            lenW2
       */
      const lenW0 = box * km.w - (r + margin) * 2;
      const lenH1 = box * km.h - (r + margin) * 2;
      const lenW2 = box * km.w2 - (r + margin) * 2;
      const lenH3 = box * km.h2 - 2.5 * r - margin;
      const lenW4 = box * (km.w2 - km.w) - 1.5 * r - margin;
      const lenH5 = box * (km.h - km.h2) - 1.5 * r - margin;
      const lenW6 = box * (km.w2 - km.w);
      path = `M${margin + r},${margin} h${lenW0} ${cw('', '')} v${lenH1} ${cw(
        '-',
        ''
      )} h-${lenW2} ${cw('-', '-')} v-${lenH3} ${cw('', '-')} h${lenW4} ${ccw(
        '',
        '-'
      )} v-${lenH5}, ${cw('', '-')} h${lenW6}`;
    } else if (km.isEncoder) {
      const radius = (box * km.w) / 2 - margin * 2;
      path = `M ${margin},${margin * 2 + radius} A ${radius},${radius} 0 1 1 ${
        radius * 2 + margin * 3
      },${margin * 2 + radius} A ${radius},${radius} 0 1 1 ${margin},${
        margin * 2 + radius
      } Z`;
    } else {
      const lenW = roofWidth;
      const lenH = roofHeight;
      path = `M${margin + r},${margin} h${lenW} ${cw('', '')} v${lenH} ${cw(
        '-',
        ''
      )} h-${lenW} ${cw('-', '-')} v-${lenH} ${cw('', '-')} Z`;
    }

    let x = rootX + km.x * box;
    let y = rootY - km.y * box;
    if (km.rotate != 0) {
      const rad = km.rotate * (Math.PI / 180);
      const xa = km.x - km.rx;
      const yb = km.y - km.ry;
      const sin = Math.sin(rad);
      const cos = Math.cos(rad);
      x = rootX + (xa * cos - yb * sin + km.rx) * box;
      y = rootY - (xa * sin + yb * cos + km.ry) * box;
    }

    const rotate = degrees(-km.rotate);
    page.drawSvgPath(path, {
      x: x,
      y: y,
      borderColor: this.gray,
      borderWidth: 1,
      rotate: rotate,
    });

    const keycapX = x + margin;
    const keycapY = y - margin;
    const labelW = roofWidth + r * 2;
    const labelH = (roofHeight + r * 2) / 3;

    const label = key.label;
    const holdLabel = buildHoldKeyLabel(key.keymap, key.keymap.isAny);
    let modifierLabel = key.meta;
    if (holdLabel === '' && modifierLabel === '') {
      modifierLabel = buildModLabel(
        key.keymap.modifiers || null,
        key.keymap.direction!
      );
    }

    const metaRight = key.metaRight ? key.metaRight : '';

    this.drawLabels(
      page,
      ['', modifierLabel, ''],
      ['', label, metaRight],
      ['', holdLabel, ''],
      keycapX,
      keycapY,
      labelW,
      labelH,
      rotate
    );
  }

  private drawLabels(
    page: PDFPage,
    topLabels: string[],
    midLabels: string[],
    btmLabels: string[],
    rootX: number,
    rootY: number,
    width: number,
    height: number,
    rotate: Degrees // degrees(deg)
  ) {
    const rad = rotate.angle * (Math.PI / 180);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const baseline = 2; // up from bottom line
    let x = [rootX, rootX, rootX];
    let y = [
      rootY - (height - baseline),
      rootY - (height - baseline) * 2,
      rootY - (height - baseline) * 3,
    ];
    if (rotate.angle != 0) {
      // calc the start position of drawText (left-bottom)
      x[0] = rootX + (height - baseline) * sin;
      x[1] = rootX + (height - baseline) * 2 * sin;
      x[2] = rootX + (height - baseline) * 3 * sin;
      y[0] = rootY - (height - baseline) * cos;
      y[1] = rootY - (height - baseline) * 2 * cos;
      y[2] = rootY - (height - baseline) * 3 * cos;
    }
    const subLabelColors = [this.grayPale, this.grayPale, this.grayPale];
    const mainLabelColors = [this.grayPale, this.gray, this.grayPale];
    // TOP label
    this.drawLabelRow(
      page,
      topLabels,
      subLabelColors,
      x[0],
      y[0],
      width,
      rotate
    );

    // MID label
    this.drawLabelRow(
      page,
      midLabels,
      mainLabelColors,
      x[1],
      y[1],
      width,
      rotate
    );

    // BOTTOM label
    this.drawLabelRow(
      page,
      btmLabels,
      subLabelColors,
      x[2],
      y[2],
      width,
      rotate
    );
  }

  /**
   * @param page PDF document
   * @param labelList  labels: ['left', 'center', 'right']  // the width rate is 3:5:3
   * @param colors colors of labels: ['left', 'center', 'right']
   * @param x  // the text start x position
   * @param y  // the text start y position
   * @param width // width of row
   * @param rotate // rotate of row
   */
  private drawLabelRow(
    page: PDFPage,
    labelList: string[], // [right, center, left]
    colors: RGB[], // [right, center, left]
    x: number, // left
    y: number, // bottom
    width: number,
    rotate: Degrees
  ) {
    const rad = rotate.angle * (Math.PI / 180);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    // TODO: draw left label

    // draw center label
    const labelCenter = labelList[1];
    const labelCenterColor = colors[1];
    const labelCenterLength = isDoubleWidthString(labelCenter)
      ? labelCenter.length * 2.1 // 2 characters of double width string should be small font size
      : labelCenter.length;

    const fontSize =
      4 < labelCenterLength ? this.fontSizeSmall : this.fontSizeNormal;
    const labelPadding = 2;
    const fontHeight = this.font!.heightAtSize(fontSize);
    let labels: string[] = this.splitLabel(
      labelCenter,
      fontSize,
      width - labelPadding * 2 /* padding for both sides  */
    );

    const verticalAlign = ((labels.length - 1) * fontHeight) / 2;
    labels.forEach((text, index) => {
      const fontWidth = this.font!.widthOfTextAtSize(text, fontSize);
      const centringX = (width - fontWidth) / 2;

      page.drawText(text, {
        x: x + centringX * cos,
        y: y + verticalAlign - index * fontHeight + centringX * sin,
        size: fontSize,
        color: labelCenterColor,
        font: this.font!,
        rotate: rotate,
      });
    });

    // draw right label
    const labelRight = labelList[2];
    if (labelRight) {
      const labelCenterRight = colors[2];
      page.drawText(labelRight, {
        x: x + ((8 * width) / 11) * cos,
        y: y + ((8 * width) / 11) * sin,
        size: fontSize,
        color: labelCenterRight,
        font: this.font!,
        rotate: rotate,
      });
    }
  }

  private drawHeader(page: PDFPage, title: string) {
    const H = page.getHeight();
    const W = page.getWidth();
    const headerY = H - this.headerH + 2;
    page.drawText(title, {
      x: this.blank,
      y: headerY,
      size: this.fontSizeNormal,
      color: this.gray,
      font: this.font!,
    });

    this.drawLogo(page, W - 75, headerY + 16, 0.3);
    page.drawLine({
      start: { x: this.blank, y: headerY - 2 },
      end: { x: W - this.blank, y: headerY - 2 },
      thickness: 0.5,
      color: this.gray,
    });
  }

  private drawLogo(page: PDFPage, x: number, y: number, scale: number) {
    const remapChars: string[] = [
      'M4.18,43.36H2a2,2,0,0,1-2-2v-36a2,2,0,0,1,2-2H9.66c3.66,0,6,.72,7.92,2.4,2.4,2,3.6,5.1,3.6,9.06,0,4.41-1.38,7.63-4.14,9.61a2,2,0,0,0-.78,2.26l4.55,14.07a2,2,0,0,1-1.9,2.62H16.64A2,2,0,0,1,14.73,42L10.35,28.31a2,2,0,0,0-1.91-1.39H8.18a2,2,0,0,0-2,2V41.36a2,2,0,0,1-2,2M8.46,21.22c2.64,0,3.84-.3,4.8-1.26s1.5-2.64,1.5-4.86-.48-3.78-1.5-4.8S11.1,9,8.46,9H8.18a2,2,0,0,0-2,2v8.18a2,2,0,0,0,2,2Z',
      'M42.46,9H34.52a2,2,0,0,0-2,2V17.6a2,2,0,0,0,2,2h4.82a2,2,0,0,1,2,2v1.7a2,2,0,0,1-2,2H34.52a2,2,0,0,0-2,2v8.36a2,2,0,0,0,2,2h7.94a2,2,0,0,1,2,2v1.7a2,2,0,0,1-2,2H28.34a2,2,0,0,1-2-2v-36a2,2,0,0,1,2-2H42.46a2,2,0,0,1,2,2V7a2,2,0,0,1-2,2',
      'M86.82,46.33H58.9A6.91,6.91,0,0,1,52,39.44V6.89A6.91,6.91,0,0,1,58.9,0H86.82a6.91,6.91,0,0,1,6.89,6.89V39.44a6.91,6.91,0,0,1-6.89,6.89M68.93,13.64a1.27,1.27,0,0,0-1.22-.92H64A1.27,1.27,0,0,0,62.72,14V32.34A1.27,1.27,0,0,0,64,33.61h2a1.27,1.27,0,0,0,1.27-1.27V28.69a1.27,1.27,0,0,1,2.49-.43l1.36,4.45a1.27,1.27,0,0,0,1.21.9h1.12a1.27,1.27,0,0,0,1.21-.9L76,28.3a1.27,1.27,0,0,1,2.48.43v3.61a1.27,1.27,0,0,0,1.27,1.27h2A1.27,1.27,0,0,0,83,32.34V14a1.27,1.27,0,0,0-1.27-1.27H78a1.27,1.27,0,0,0-1.22.92L74.08,23a1.27,1.27,0,0,1-2.44,0l-2.71-9.38',
      'M132.82,46.33H104.9A6.91,6.91,0,0,1,98,39.44V6.89A6.91,6.91,0,0,1,104.9,0h27.92a6.91,6.91,0,0,1,6.88,6.89V39.44a6.91,6.91,0,0,1-6.88,6.89m-12-16.63a1.54,1.54,0,0,1,1.48,1.12l.47,1.67a1.52,1.52,0,0,0,1.47,1.12h1.58a1.53,1.53,0,0,0,1.45-2l-5.92-17.82a1.54,1.54,0,0,0-1.45-1h-2a1.55,1.55,0,0,0-1.46,1.06l-5.88,17.81a1.55,1.55,0,0,0,1.46,2h1.55A1.53,1.53,0,0,0,115,32.48l.46-1.65a1.54,1.54,0,0,1,1.48-1.13h3.88m-1.94-3.88a1.53,1.53,0,1,1,1.47-1.95,1.54,1.54,0,0,1-1.47,1.95h0',
      'M178.73,46.33H150.81a6.91,6.91,0,0,1-6.89-6.89V6.89A6.91,6.91,0,0,1,150.81,0h27.92a6.91,6.91,0,0,1,6.89,6.89V39.44a6.91,6.91,0,0,1-6.89,6.89M161.9,28.17a1.65,1.65,0,0,1,1.65-1.65h1.32a9.08,9.08,0,0,0,3-.48,6.5,6.5,0,0,0,2.3-1.36,5.87,5.87,0,0,0,1.44-2.12,7.13,7.13,0,0,0,.51-2.75,7.66,7.66,0,0,0-.51-2.83,6.3,6.3,0,0,0-1.44-2.25,6.75,6.75,0,0,0-2.3-1.48,8.37,8.37,0,0,0-3-.53H159a1.65,1.65,0,0,0-1.65,1.65V32A1.65,1.65,0,0,0,159,33.61h1.24A1.64,1.64,0,0,0,161.9,32V28.17m0-9.91a1.65,1.65,0,0,1,1.65-1.65h1.32a2.56,2.56,0,0,1,1.22.27,2.31,2.31,0,0,1,.84.71,3,3,0,0,1,.49,1,4.93,4.93,0,0,1,.15,1.23,4,4,0,0,1-.15,1.12,2.36,2.36,0,0,1-.49.88,2.24,2.24,0,0,1-.84.59,3.39,3.39,0,0,1-1.22.2h-1.32A1.64,1.64,0,0,1,161.9,21Z',
    ];
    page.drawSvgPath(remapChars.join(''), {
      x: x,
      y: y,
      scale: scale,
      color: this.black,
      borderWidth: 0,
    });
  }

  private drawFooter(page: PDFPage, text: string) {
    const W = page.getWidth();
    const fontSize = this.fontSizeSmall;
    const footerY = this.footerH;
    const fontHeight = this.font!.heightAtSize(fontSize);
    const textWidth = this.font!.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: W - this.blank - textWidth,
      y: footerY - fontHeight - 2,
      size: fontSize,
      color: this.grayPale,
      font: this.font!,
    });
    page.drawLine({
      start: { x: this.blank, y: this.footerH },
      end: { x: W - this.blank, y: this.footerH },
      thickness: 0.5,
      color: this.gray,
    });
  }

  private splitLabel(
    label: string,
    fontSize: number,
    limitWidth: number
  ): string[] {
    const list: string[] = [];

    const _split = (str: string) => {
      const fontWidth = this.font!.widthOfTextAtSize(str, fontSize);
      if (limitWidth < fontWidth) {
        const index =
          0 <= str.indexOf(' ') ? str.indexOf(' ') : str.indexOf('/');
        if (index < 0) {
          list.push(str);
        } else {
          const head = str.slice(0, index + 1).trimEnd(); // include '/', exclude ' '
          list.push(head);
          const tail = str.slice(index + 1);
          _split(tail);
        }
      } else {
        list.push(str);
      }
    };

    _split(label);
    return list;
  }
}
