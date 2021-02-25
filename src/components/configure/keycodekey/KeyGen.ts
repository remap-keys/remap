import { KeyLabel } from '../../../assets/keylabels/KeyLabel';
import { KEY_LABELS_JIS } from '../../../assets/keylabels/KeyLabelJis';
import { IMod, MOD_LEFT, MOD_RIGHT } from '../../../services/hid/Composition';
import { IKeymap } from '../../../services/hid/Hid';
import { hexadecimal } from '../../../utils/StringUtils';

export type Key = {
  label: string;
  meta: string;
  keymap: IKeymap;
};

type KEYBOARD_LABEL_LANG = 'us' | 'jis';

type Keytop2Lines = {
  label: string;
  meta: string;
};

const MOD_SHORT_LABELS = ['0', 'C', 'S', '3', 'A', '5', '6', '7', 'W'];

function buildOriginKeyCombination(keymap: IKeymap): string {
  const mods: string = keymap.modifiers
    .map((m: IMod) => MOD_SHORT_LABELS[m])
    .join('+');
  if (mods.length === 0) {
    return '';
  }
  const modLeft = keymap.direction === MOD_LEFT ? '*' : '';
  const modRight = keymap.direction === MOD_RIGHT ? '*' : '';
  return `(${modLeft}${mods}+${keymap.keycodeInfo.label}${modRight})`;
}

function findKeytop2Lines(keymap: IKeymap, labels: KeyLabel[]): Keytop2Lines {
  let keytop: Keytop2Lines = {
    label: keymap.keycodeInfo.label,
    meta: '',
  };

  const keyLabel: KeyLabel | undefined = labels.find(
    (item) => item.code == keymap.code
  );

  if (keyLabel) {
    keytop.label = keyLabel.label;
    if (keyLabel.meta) {
      keytop.meta = keyLabel.meta[0].label;
    } else {
      keytop.meta = buildOriginKeyCombination(keymap);
    }
  }

  return keytop;
}

export const genKey = (
  keymap: IKeymap,
  lang: KEYBOARD_LABEL_LANG = 'us'
): Key => {
  // TODO: change the keytop label according to the platform, like JIS keyboard, mac US keyboard
  if (keymap.isAny) {
    return {
      label: keymap.keycodeInfo
        ? keymap.keycodeInfo.label
        : `${hexadecimal(keymap.code)}`,
      meta: '',
      keymap,
    };
  } else {
    const keytop: Keytop2Lines = findKeytop2Lines(keymap, KEY_LABELS_JIS);
    return { label: keytop.label, meta: keytop.meta, keymap };
  }
};

export const genKeys = (keymaps: IKeymap[]): Key[] => {
  return keymaps.map<Key>((keymap) => genKey(keymap));
};
