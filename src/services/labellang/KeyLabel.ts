export type KeyLabel = {
  code: number;
  label: string;
  meta?: {
    label: string;
    modifiers: number;
  }[];
};

export const getMetaLabel = (keyLabel: KeyLabel, mods: number): string => {
  if (!keyLabel.meta) return '';

  const meta = keyLabel.meta.find((m) => {
    return m.modifiers === mods;
  });

  if (meta) {
    return meta.label;
  }
  return '';
};

export const MOD = {
  RIGHT: 0b10000,
  CTL: 0b0001,
  SFT: 0b0010,
  ALT: 0b0100,
  GUI: 0b1000,
};
