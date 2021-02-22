import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFPage,
  PDFFont,
  degrees,
  Degrees,
} from 'pdf-lib';
import { KeyOp } from '../../gen/types/KeyboardDefinition';
import KeyboardModel from '../../models/KeyboardModel';
import KeyModel from '../../models/KeyModel';
import download from 'downloadjs';

type KeymapType = ((string | KeyOp)[] | { name: string })[];
export class KeymapPdfGenerator {
  // readonly black = rgb(0, 0, 0);
  readonly gray = rgb(0.3, 0.3, 0.3);
  readonly grayPale = rgb(0.5, 0.5, 0.5);
  // readonly red = rgb(1, 0, 0);
  readonly headerH = 24;
  readonly blank = 16; // empty space of left, right and bottom
  readonly keyboardMarginWidth = 16;
  readonly kbdR = 8;
  readonly contentTopMargin = 16;
  readonly layerHeaderHeight = 16;
  model: KeyboardModel;
  doc: PDFDocument | null = null;
  font: PDFFont | null = null;
  constructor(keymap: KeymapType) {
    this.model = new KeyboardModel(keymap);
  }

  async genPdf(
    name: string,
    options?: { option: string; optionChoice: string }[]
  ) {
    const { keymaps, width, height, left } = this.model.getKeymap(options);
    const keyboardHeight = height + this.kbdR * 2;
    console.log(`w: ${width}, h: ${height}, left: ${left}`);
    this.doc = await PDFDocument.create();
    this.font = await this.doc.embedFont(StandardFonts.Courier);
    const layer = 1; // num of layers
    const W = width + (this.blank + this.keyboardMarginWidth + this.kbdR) * 2;
    const H =
      (this.contentTopMargin + this.layerHeaderHeight + keyboardHeight) *
        layer +
      this.blank +
      this.headerH;

    console.log(`(W, H)=(${W}, ${H})`);
    const page = this.doc.addPage([W, H]);

    // header
    this.drawHeader(page, `${name} keymap cheatsheet`);

    const contentX = this.blank + this.keyboardMarginWidth;
    const contentY = H - this.headerH;

    let y = contentY;
    for (let i = 0; i < layer; i++) {
      const keyboardContentHeight = keyboardHeight + this.layerHeaderHeight;
      y -= this.contentTopMargin;
      this.drawLayerContent(page, i, keymaps, contentX, y, width, height);
      y -= keyboardContentHeight;
    }

    const pdfBytes = await this.doc.save();
    download(
      pdfBytes,
      `${name.replace(/\s+/g, '_').toLocaleLowerCase()}_keymap_cheatsheet.pdf`,
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
      size: 12,
      color: this.gray,
      font: this.font!,
    });
    this.drawLayer(
      page,
      keymaps,
      x,
      layerHeaderY,
      keyboardWidth,
      keyboardHeight
    );
  }

  private drawLayer(
    page: PDFPage,
    keymaps: KeyModel[],
    x: number,
    y: number,
    keyboardWidth: number,
    keyboardHeight: number
  ) {
    // keyboard base
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
    const keymapX = x + this.kbdR;
    const keymapY = y - this.kbdR;
    keymaps.forEach((km: KeyModel) => {
      if (km.isDecal) return;
      this.drawKeycap(page, km, keymapX, keymapY);
    });
  }

  private drawKeycap(
    page: PDFPage,
    km: KeyModel,
    rootX: number,
    rootY: number
  ) {
    const box = 56;
    const margin = 2;
    const r = 4;

    const lenW = box * km.w - (r + margin) * 2;
    const lenH = box * km.h - (r + margin) * 2;
    const path = `M${
      margin + r
    },${margin} h${lenW} a${r},${r} 0 0 1 ${r},${r} v${lenH} a${r},${r} 0 0 1 -${r},${r} h-${lenW} a${r},${r} 0 0 1 -${r},-${r} v-${lenH} a${r},${r} 0 0 1 ${r},-${r} Z`;

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

    console.log(
      `${km.pos} / km.x, km.y, km.rx, km.ry, km.r = ${km.x}, ${km.y}, ${km.rx}, ${km.ry}, ${km.rotate}`
    );
    console.log(`${km.pos} / x, y = ${x}, ${y}`);

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
    const labelW = lenW + r * 2;
    const labelH = (lenH + r * 2) / 3;
    this.drawLabels(
      page,
      '@',
      'A',
      '0xFFFFFF',
      keycapX,
      keycapY,
      labelW,
      labelH,
      rotate
    );
  }

  private drawLabels(
    page: PDFPage,
    topLabel: string,
    midLabel: string,
    btmLabel: string,
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
    // TOP label
    this.drawLabel(page, topLabel, x[0], y[0], width, rotate, sin, cos);

    // MID label
    this.drawLabel(page, midLabel, x[1], y[1], width, rotate, sin, cos);

    // BOTTOM label
    this.drawLabel(page, btmLabel, x[2], y[2], width, rotate, sin, cos);
  }

  private drawLabel(
    page: PDFPage,
    label: string,
    x: number, // left
    y: number, // bottom
    width: number,
    rotate: Degrees,
    sin: number,
    cos: number
  ) {
    const { fontSize, fontPx } =
      3 < label.length
        ? { fontSize: 9, fontPx: 5.5 }
        : { fontSize: 12, fontPx: 8 };
    const centringX = (width - label.length * fontPx) / 2;

    page.drawText(label, {
      x: x + centringX * cos,
      y: y + centringX * sin,
      size: fontSize,
      color: this.gray,
      font: this.font!,
      rotate: rotate,
    });
  }

  private drawHeader(page: PDFPage, title: string) {
    const H = page.getHeight();
    const W = page.getWidth();
    const headerX = 16;
    const headerY = H - this.headerH + 2;
    page.drawText(title, {
      x: headerX,
      y: headerY,
      size: 12,
      color: this.gray,
      font: this.font!,
    });
    const credit = 'generated by Remap.';
    page.drawText(credit, {
      x: W - headerX - credit.length * 6,
      y: headerY,
      size: 10,
      color: this.grayPale,
      font: this.font!,
    });
    page.drawLine({
      start: { x: headerX, y: headerY - 2 },
      end: { x: W - headerX, y: headerY - 2 },
      thickness: 0.5,
      color: this.gray,
    });
  }
}
