import { KeyboardLabelLang } from '../../components/configure/keycodekey/KeyGen';
import { IMod } from '../../services/hid/Composition';
import { KeyLabelJp } from './KeyLabelJp';
import { KeyLabelUs } from './KeyLabelUs';

type KeyModifier =
  | 'LeftShift'
  | 'RightShift'
  | 'LeftAlt'
  | 'RightAlt'
  | 'LeftCtrl'
  | 'RightCtrl';

export type KeyLabel = {
  code: number;
  label: string;
  meta?: {
    label: string;
    modifiers: KeyModifier[];
  }[];
};

export const KeyLabelLangMap: { [lang: string]: KeyLabel[] } = {
  jp: KeyLabelJp,
  us: KeyLabelUs,
};

export const findKeyLabel = (
  code: number,
  mods: IMod[],
  labelLang: KeyboardLabelLang
): KeyLabel | undefined => {
  const labelLangs = KeyLabelLangMap[labelLang];
  const keyLabel = labelLangs.find((ll) => {
    ll.code === code;
  });
  return keyLabel;
};
