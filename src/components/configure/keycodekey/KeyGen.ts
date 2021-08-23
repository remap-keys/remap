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
  KEY_LABEL_LANGS,
} from '../../../services/labellang/KeyLabelLangs';
import { mods2Number } from '../customkey/Modifiers';
import _ from 'lodash';

export type Key = {
  label: string;
  meta: string; // top-center
  metaRight?: string; // mid-right
  keymap: IKeymap;
};

type Keytop = {
  keywords: string[]; // for search keys
  label: string;
  meta: string; // label with shift
  metaRight?: string;
};

const KeyboardLabelLangs: KeyboardLabelLang[] = KEY_LABEL_LANGS.map(
  (item) => item.labelLang
);

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

function findKeytop(keymap: IKeymap, labels: KeyLabel[]): Keytop {
  let keytop: Keytop = {
    label: keymap.keycodeInfo.label,
    meta: '',
    metaRight: undefined,
    keywords: [],
  };

  const keyLabel: KeyLabel | undefined = labels.find(
    (item) => item.code == keymap.code
  );

  if (keyLabel) {
    keytop.keywords = keyLabel.keywords ?? [];
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
  }

  if (KeyboardLabelLangs.includes(lang)) {
    const keytop: Keytop = findKeytop(keymap, KeyLabelLangs.getKeyLabels(lang));

    let newKeymap: IKeymap = keymap;
    if (0 < keytop.keywords.length) {
      newKeymap = _.cloneDeep(keymap) as IKeymap;
      newKeymap.keycodeInfo.keywords = newKeymap.keycodeInfo.keywords.concat(
        keytop.keywords
      );
    }

    return {
      label: keytop.label,
      meta: keytop.meta,
      metaRight: keytop.metaRight || undefined,
      keymap: newKeymap,
    };
  }

  return {
    label: keymap.keycodeInfo
      ? keymap.keycodeInfo.label
      : `${hexadecimal(keymap.code)}`,
    meta: '',
    keymap,
  };
};

export const genKeys = (
  keymaps: IKeymap[],
  labelLang: KeyboardLabelLang
): Key[] => {
  return keymaps.map<Key>((keymap) => genKey(keymap, labelLang));
};
