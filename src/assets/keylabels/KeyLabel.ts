import { KeyboardLabelLang } from '../../components/configure/keycodekey/KeyGen';
import { KeyLabelJp } from './KeyLabelJp';
import { KeyLabelUs } from './KeyLabelUs';

export type KeyLabel = {
  code: number;
  label: string;
  meta?: {
    label: string;
    modifiers: number;
  }[];
};

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

export const KeyLabelLangMap: { [lang: string]: KeyLabel[] } = {
  jp: genKeyLabels(KeyLabelJp),
  us: genKeyLabels(KeyLabelUs),
};

export const findKeyLabel = (
  code: number,
  mods: number,
  labelLang: KeyboardLabelLang
): KeyLabel | undefined => {
  const labelLangs = KeyLabelLangMap[labelLang];
  const keyLabel = labelLangs.find((ll) => {
    return (
      ll.code === code &&
      ll.meta &&
      Boolean(ll.meta.find((m) => m.modifiers === mods))
    );
  });
  return keyLabel;
};

export const getMetaLabel = (keyLabel: KeyLabel, mods: number): string => {
  if (!keyLabel.meta) return '';

  const meta = keyLabel.meta.find((m) => {
    m.modifiers === mods;
  });
  if (meta) {
    return meta.label;
  }
  return '';
};
