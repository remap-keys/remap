import { IKeymap } from './Hid';
import {
  KEY_CATEGORY_ASCII,
  KEY_SUB_CATEGORY_APPLICATION,
  KEY_SUB_CATEGORY_COMMAND,
  KEY_SUB_CATEGORY_DEVICE,
  KEY_SUB_CATEGORY_EDIT,
  KEY_SUB_CATEGORY_F,
  KEY_SUB_CATEGORY_GUI,
  KEY_SUB_CATEGORY_INTERNATIONAL,
  KEY_SUB_CATEGORY_LANGUAGE,
  KEY_SUB_CATEGORY_LETTER,
  KEY_SUB_CATEGORY_LOCK,
  KEY_SUB_CATEGORY_MEDIA,
  KEY_SUB_CATEGORY_MODIFIER,
  KEY_SUB_CATEGORY_MOUSE,
  KEY_SUB_CATEGORY_MOVE,
  KEY_SUB_CATEGORY_NUMBER,
  KEY_SUB_CATEGORY_NUMPAD,
  KEY_SUB_CATEGORY_PUNCTUATION,
} from './KeyCategoryList';

export const CATEGORY_LABEL_ASCII = 'ASCII';

export function macroCodeFilter(keymaps: IKeymap[]): IKeymap[] {
  return keymaps.filter((km) => MACRO_QMK_KEYCODES.includes(km.code));
}

const MACRO_QMK_KEYCODES: number[] = [
  // letter
  ...KEY_SUB_CATEGORY_LETTER.codes,
  // number
  ...KEY_SUB_CATEGORY_NUMBER.codes,
  // mods
  ...KEY_SUB_CATEGORY_MODIFIER.codes,
  // edit
  ...KEY_SUB_CATEGORY_EDIT.codes,
  // move
  ...KEY_SUB_CATEGORY_MOVE.codes,
  // numpad
  ...KEY_SUB_CATEGORY_NUMPAD.codes,
  // punctuation
  ...KEY_SUB_CATEGORY_PUNCTUATION.codes,
  // F
  ...KEY_SUB_CATEGORY_F.codes,
  // international
  ...KEY_SUB_CATEGORY_INTERNATIONAL.codes,
  // language
  ...KEY_SUB_CATEGORY_LANGUAGE.codes,
  // lock
  ...KEY_SUB_CATEGORY_LOCK.codes,
  // device
  ...KEY_SUB_CATEGORY_DEVICE.codes,
  // mouse
  ...KEY_SUB_CATEGORY_MOUSE.codes,
  // gui
  ...KEY_SUB_CATEGORY_GUI.codes,
  // command
  ...KEY_SUB_CATEGORY_COMMAND.codes,
  // media
  ...KEY_SUB_CATEGORY_MEDIA.codes,
  // app
  ...KEY_SUB_CATEGORY_APPLICATION.codes,
  // ascii
  ...KEY_CATEGORY_ASCII.codes,
];
