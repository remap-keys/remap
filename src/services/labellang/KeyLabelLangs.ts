import { KeyLabel } from './KeyLabel';
import { KeyLabelJp } from './KeyLabelJp';
import { KeyLabelUk } from './KeyLabelUk';
import { KeyLabelUs } from './KeyLabelUs';

export type KeyboardLabelLang = 'us' | 'jp' | 'uk';

function genKeyLabels(keylabels: KeyLabel[]): KeyLabel[] {
  let list: KeyLabel[] = [];
  keylabels.forEach((keyLabel) => {
    list.push(keyLabel);
    if (keyLabel.meta) {
      keyLabel.meta.forEach((meta) => {
        const code = (meta.modifiers << 8) | keyLabel.code;
        const label = meta.label;
        const modKeyLabel: KeyLabel = {
          code,
          label,
        };
        list.push(modKeyLabel);
      });
    }
  });
  return list;
}

const KEY_LABEL_LANGS: {
  labelLang: KeyboardLabelLang;
  keyLabels: KeyLabel[];
  menuLabel: string;
}[] = [
  { labelLang: 'jp', keyLabels: genKeyLabels(KeyLabelJp), menuLabel: 'JIS' },
  { labelLang: 'us', keyLabels: genKeyLabels(KeyLabelUs), menuLabel: 'US' },
  { labelLang: 'uk', keyLabels: genKeyLabels(KeyLabelUk), menuLabel: 'UK' },
];

export class KeyLabelLangs {
  static readonly KeyLabelLangMenus: {
    labelLang: KeyboardLabelLang;
    menuLabel: string;
  }[] = KEY_LABEL_LANGS.map((kll) => {
    return {
      labelLang: kll.labelLang,
      menuLabel: kll.menuLabel,
    };
  });

  static getKeyLabels(labelLang: KeyboardLabelLang): KeyLabel[] {
    const keyLabels = KEY_LABEL_LANGS.find(
      (kll) => kll.labelLang === labelLang
    );
    if (keyLabels === undefined) {
      throw new Error(`Undeifned label language: ${labelLang}`);
    }
    return keyLabels!.keyLabels;
  }

  static getAllLabelLangs(): KeyboardLabelLang[] {
    return KEY_LABEL_LANGS.map((item) => item.labelLang);
  }

  static getLabelLangMenuLabel(labelLang: KeyboardLabelLang): string {
    const keyLabels = KEY_LABEL_LANGS.find(
      (kll) => kll.labelLang === labelLang
    );
    if (keyLabels === undefined) {
      throw new Error(`Undeifned label language: ${labelLang}`);
    }
    return keyLabels!.menuLabel;
  }

  static findKeyLabel(
    code: number,
    mods: number,
    labelLang: KeyboardLabelLang
  ): KeyLabel | undefined {
    const item = KEY_LABEL_LANGS.find((item) => item.labelLang === labelLang);
    if (item === undefined) {
      throw new Error(`Undefined label language: ${labelLang}`);
    }
    const keyLabel = item.keyLabels.find(
      (kl) =>
        kl.code === code && kl.meta && kl.meta.find((m) => m.modifiers === mods)
    );
    return keyLabel;
  }
}
