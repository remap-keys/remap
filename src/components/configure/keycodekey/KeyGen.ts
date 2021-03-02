import { getMetaLabel, KeyLabel } from '../../../services/labellang/KeyLabel';
import {
  IMod,
  MOD_ALT,
  MOD_LEFT,
  MOD_RIGHT,
  MOD_SFT,
} from '../../../services/hid/Composition';
import { IKeymap } from '../../../services/hid/Hid';
import { hexadecimal } from '../../../utils/StringUtils';
import {
  KeyboardLabelLang,
  KeyLabelLangs,
} from '../../../services/labellang/KeyLabelLangs';
import { mods2Number } from '../customkey/Modifiers';

export type Key = {
  label: string;
  meta: string; // top-center
  metaRight?: string; // mid-right
  keymap: IKeymap;
};

type KeytopWithShift = {
  label: string;
  meta: string; // label with shift
};
type KeytopWithShiftRightALt = {
  label: string;
  meta: string; // label with shift(show the label at top-center)
  metaRight: string; // label with RightAlt(show the label at mid-right)
};
export const KetopWithShiftLangs: KeyboardLabelLang[] = [
  'en-us',
  'ja-jp',
  'en-gb',
];
export const KetopWithShiftRightAltLangs: KeyboardLabelLang[] = [];

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

function findKeytopWithShift(
  keymap: IKeymap,
  labels: KeyLabel[]
): KeytopWithShift {
  let keytop: KeytopWithShift = {
    label: keymap.keycodeInfo.label,
    meta: '',
  };

  const keyLabel: KeyLabel | undefined = labels.find(
    (item) => item.code == keymap.code
  );

  if (keyLabel) {
    if (keyLabel.meta) {
      keytop.label = keyLabel.label;
      keytop.meta = getMetaLabel(keyLabel, MOD_SFT);
    } else {
      keytop.label = keyLabel.label;
      keytop.meta = buildOriginKeyCombination(keymap);
    }
  }

  return keytop;
}

function findKeytopWithShiftRightAlt(
  keymap: IKeymap,
  labels: KeyLabel[]
): KeytopWithShiftRightALt {
  let keytop: KeytopWithShiftRightALt = {
    label: keymap.keycodeInfo.label,
    meta: '',
    metaRight: '',
  };

  const keyLabel: KeyLabel | undefined = labels.find(
    (item) => item.code == keymap.code
  );

  if (keyLabel) {
    if (keyLabel.meta) {
      keytop.label = keyLabel.label;
      keytop.meta = getMetaLabel(keyLabel, MOD_SFT);
      keytop.metaRight = getMetaLabel(
        keyLabel,
        mods2Number([MOD_ALT], MOD_RIGHT)
      );
    } else {
      keytop.label = keyLabel.label;
      keytop.meta = buildOriginKeyCombination(keymap);
    }
  }

  return keytop;
}

export const genKey = (keymap: IKeymap, lang: KeyboardLabelLang): Key => {
  if (keymap.isAny) {
    return {
      label: keymap.keycodeInfo
        ? keymap.keycodeInfo.label
        : `${hexadecimal(keymap.code)}`,
      meta: '',
      keymap,
    };
  } else {
    if (KetopWithShiftLangs.includes(lang)) {
      const keytop: KeytopWithShift = findKeytopWithShift(
        keymap,
        KeyLabelLangs.getKeyLabels(lang)
      );
      return { label: keytop.label, meta: keytop.meta, keymap };
    } else if (KetopWithShiftRightAltLangs.includes(lang)) {
      const keytop: KeytopWithShiftRightALt = findKeytopWithShiftRightAlt(
        keymap,
        KeyLabelLangs.getKeyLabels(lang)
      );
      return { ...keytop, keymap };
    } else {
      return {
        label: keymap.keycodeInfo
          ? keymap.keycodeInfo.label
          : `${hexadecimal(keymap.code)}`,
        meta: '',
        keymap,
      };
    }
  }
};

export const genKeys = (
  keymaps: IKeymap[],
  labelLang: KeyboardLabelLang
): Key[] => {
  return keymaps.map<Key>((keymap) => genKey(keymap, labelLang));
};
