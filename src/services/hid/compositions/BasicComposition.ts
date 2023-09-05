import { anyKeymap, IComposition, MOD_LEFT } from '../Composition';
import { IKeycodeCategoryInfo, IKeycodeInfo, IKeymap } from '../Hid';
import {
  KeyboardLabelLang,
  KeyLabelLangs,
} from '../../labellang/KeyLabelLangs';
import {
  KEY_SUB_CATEGORY_APPLICATION,
  KEY_SUB_CATEGORY_BLANK,
  KEY_SUB_CATEGORY_COMMAND,
  KEY_SUB_CATEGORY_DEVICE,
  KEY_SUB_CATEGORY_EDIT,
  KEY_SUB_CATEGORY_F,
  KEY_SUB_CATEGORY_GUI,
  KEY_SUB_CATEGORY_INTERNATIONAL,
  KEY_SUB_CATEGORY_LANGUAGE,
  KEY_SUB_CATEGORY_LETTER,
  KEY_SUB_CATEGORY_LOCK,
  KEY_SUB_CATEGORY_MEDIA,
  KEY_SUB_CATEGORY_MODIFIER,
  KEY_SUB_CATEGORY_MOUSE,
  KEY_SUB_CATEGORY_MOVE,
  KEY_SUB_CATEGORY_NUMBER,
  KEY_SUB_CATEGORY_NUMPAD,
  KEY_SUB_CATEGORY_PUNCTUATION,
} from '../KeyCategoryList';
import { KeyLabel } from '../../labellang/KeyLabel';
import { keyInfoList } from '../KeycodeInfoList';

export const QK_BASIC_MIN = 0b0000_0000_0000_0000;
export const QK_BASIC_MAX = 0b0000_0000_1111_1111;

export interface IBasicComposition extends IComposition {}

export class BasicComposition implements IBasicComposition {
  private static _keymaps: { [lang: string]: IKeymap[] } = {};
  private readonly key: IKeymap;

  constructor(key: IKeymap) {
    this.key = key;
  }

  getCode(): number {
    return this.key.code & 0b1111_1111;
  }

  genKeymap(): IKeymap | undefined {
    if (this.key) {
      return JSON.parse(JSON.stringify(this.key));
    } else {
      return undefined;
    }
  }

  static genKeymaps(labelLang: KeyboardLabelLang): IKeymap[] {
    if (
      Object.prototype.hasOwnProperty.call(BasicComposition._keymaps, labelLang)
    )
      return this._keymaps[labelLang];

    const list: IKeycodeCategoryInfo[] = [
      // basic
      KEY_SUB_CATEGORY_LETTER,
      KEY_SUB_CATEGORY_NUMBER,
      KEY_SUB_CATEGORY_NUMPAD,
      KEY_SUB_CATEGORY_MODIFIER,
      KEY_SUB_CATEGORY_EDIT,
      KEY_SUB_CATEGORY_MOVE,
      // symbol
      KEY_SUB_CATEGORY_BLANK,
      KEY_SUB_CATEGORY_PUNCTUATION,
      // function
      KEY_SUB_CATEGORY_F,
      KEY_SUB_CATEGORY_INTERNATIONAL,
      KEY_SUB_CATEGORY_LANGUAGE,
      KEY_SUB_CATEGORY_LOCK,
      // special
      KEY_SUB_CATEGORY_GUI,
      KEY_SUB_CATEGORY_COMMAND,
      KEY_SUB_CATEGORY_MEDIA,
      KEY_SUB_CATEGORY_APPLICATION,
      // device
      KEY_SUB_CATEGORY_DEVICE,
      KEY_SUB_CATEGORY_MOUSE,
    ];

    const keyLabels: KeyLabel[] = KeyLabelLangs.getKeyLabels(labelLang) || [];
    const normalKeymaps: IKeymap[] = [];
    list.forEach((category) => {
      const kinds = category.kinds;
      category.codes.forEach((code) => {
        let keyInfo = keyInfoList.find(
          (info) => info.keycodeInfo.code === code
        );

        const desc = keyInfo ? keyInfo.desc : 'Unknown';
        let keycodeInfo: IKeycodeInfo;
        if (keyInfo) {
          const keyLabelLang = keyLabels.find((keyLabel: KeyLabel) => {
            return keyLabel.code === keyInfo!.keycodeInfo.code;
          });
          if (keyLabelLang) {
            keycodeInfo = { ...keyInfo.keycodeInfo, label: keyLabelLang.label };
          } else {
            keycodeInfo = keyInfo.keycodeInfo;
          }
        } else {
          keycodeInfo = anyKeymap(code).keycodeInfo;
        }

        const km: IKeymap = {
          code,
          kinds,
          desc,
          keycodeInfo,
          isAny: false,
          direction: MOD_LEFT,
          modifiers: [],
        };
        normalKeymaps.push(km);
      });
    });
    BasicComposition._keymaps[labelLang] = normalKeymaps;
    return BasicComposition._keymaps[labelLang];
  }

  static findKeymap(
    code: number,
    labelLang: KeyboardLabelLang
  ): IKeymap | undefined {
    const list: IKeymap[] = BasicComposition.genKeymaps(labelLang);
    const basic = list.find((km) => km.code === code);
    return basic;
  }
}
