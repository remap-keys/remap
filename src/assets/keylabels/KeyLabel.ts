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
