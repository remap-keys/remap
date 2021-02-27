import { KeyboardLabelLang } from '../../components/configure/keycodekey/KeyGen';
import { KeyLabel } from './KeyLabel';
import { KeyLabelJp } from './KeyLabelJp';
import { KeyLabelUs } from './KeyLabelUs';

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
