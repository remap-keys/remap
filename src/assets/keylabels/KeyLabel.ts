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
