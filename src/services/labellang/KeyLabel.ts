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
