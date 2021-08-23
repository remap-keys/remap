import { KeyLabel } from './KeyLabel';
import { KeyLabelBelgian } from './KeyLabelBelgian';
import { KeyLabelBepo } from './KeyLabelBepo';
import { KeyLabelBr_abnt2 } from './KeyLabelBr_abnt2';
import { KeyLabelCanadian_multilingual } from './KeyLabelCanadian_multilingual';
import { KeyLabelColemak } from './KeyLabelColemak';
import { KeyLabelCroatian } from './KeyLabelCroatian';
import { KeyLabelCzech } from './KeyLabelCzech';
import { KeyLabelDanish } from './KeyLabelDanish';
import { KeyLabelDvorak } from './KeyLabelDvorak';
import { KeyLabelDvorak_fr } from './KeyLabelDvorak_fr';
import { KeyLabelDvp } from './KeyLabelDvp';
import { KeyLabelEstonian } from './KeyLabelEstonian';
import { KeyLabelFinnish } from './KeyLabelFinnish';
import { KeyLabelFrench } from './KeyLabelFrench';
import { KeyLabelFrench_afnor } from './KeyLabelFrench_afnor';
import { KeyLabelFrench_osx } from './KeyLabelFrench_osx';
import { KeyLabelFr_ch } from './KeyLabelFr_ch';
import { KeyLabelGerman } from './KeyLabelGerman';
import { KeyLabelGerman_ch } from './KeyLabelGerman_ch';
import { KeyLabelGerman_osx } from './KeyLabelGerman_osx';
import { KeyLabelGreek } from './KeyLabelGreek';
import { KeyLabelHebrew } from './KeyLabelHebrew';
import { KeyLabelHungarian } from './KeyLabelHungarian';
import { KeyLabelIcelandic } from './KeyLabelIcelandic';
import { KeyLabelIrish } from './KeyLabelIrish';
import { KeyLabelItalian } from './KeyLabelItalian';
import { KeyLabelItalian_osx_ansi } from './KeyLabelItalian_osx_ansi';
import { KeyLabelItalian_osx_iso } from './KeyLabelItalian_osx_iso';
import { KeyLabelJp } from './KeyLabelJp';
import { KeyLabelKorean } from './KeyLabelKorean';
import { KeyLabelLatvian } from './KeyLabelLatvian';
import { KeyLabelLithuanian_azerty } from './KeyLabelLithuanian_azerty';
import { KeyLabelLithuanian_qwerty } from './KeyLabelLithuanian_qwerty';
import { KeyLabelNeo2 } from './KeyLabelNeo2';
import { KeyLabelNorman } from './KeyLabelNorman';
import { KeyLabelNorwegian } from './KeyLabelNorwegian';
import { KeyLabelPolish } from './KeyLabelPolish';
import { KeyLabelPortuguese } from './KeyLabelPortuguese';
import { KeyLabelPortuguese_osx_iso } from './KeyLabelPortuguese_osx_iso';
import { KeyLabelRomanian } from './KeyLabelRomanian';
import { KeyLabelRussian } from './KeyLabelRussian';
import { KeyLabelSerbian } from './KeyLabelSerbian';
import { KeyLabelSerbian_latin } from './KeyLabelSerbian_latin';
import { KeyLabelSlovak } from './KeyLabelSlovak';
import { KeyLabelSlovenian } from './KeyLabelSlovenian';
import { KeyLabelSpanish } from './KeyLabelSpanish';
import { KeyLabelSpanish_dvorak } from './KeyLabelSpanish_dvorak';
import { KeyLabelSwedish } from './KeyLabelSwedish';
import { KeyLabelTurkish_f } from './KeyLabelTurkish_f';
import { KeyLabelTurkish_q } from './KeyLabelTurkish_q';
import { KeyLabelUk } from './KeyLabelUk';
import { KeyLabelUs } from './KeyLabelUs';
import { KeyLabelUs_international } from './KeyLabelUs_international';
import { KeyLabelWorkman } from './KeyLabelWorkman';
import { KeyLabelWorkman_zxcvm } from './KeyLabelWorkman_zxcvm';

// RFC3066 https://tools.ietf.org/html/rfc3066
export type KeyboardLabelLang =
  | 'en-ca'
  | 'hr-hr'
  | 'cs-cz'
  | 'da-dk'
  | 'nl-be'
  | 'en-ie'
  | 'en-us'
  | 'en-gb'
  | 'en-us-int'
  | 'et-ee'
  | 'fi-fi'
  | 'fr-fr'
  | 'fr-fr-afnor'
  | 'fr-fr-bepo'
  | 'fr-be'
  | 'fr-ch'
  | 'fr-fr-mac'
  | 'de-de'
  | 'de-ch'
  | 'de-de-mac'
  | 'de-de-neo2'
  | 'el-gr'
  | 'he-il'
  | 'hu-hu'
  | 'is-is'
  | 'it-it'
  | 'it-it-mac-ansi'
  | 'it-it-mac-iso'
  | 'ja-jp'
  | 'ko-kr'
  | 'lv-lv'
  | 'lt-lt-azerty'
  | 'lt-lt-qwertz'
  | 'nb-no'
  | 'pl-pl'
  | 'pt-pt'
  | 'pt-pt-mac'
  | 'pt-br'
  | 'ro-ro'
  | 'ru-ru'
  | 'sr-sp'
  | 'sr-sp-latin'
  | 'sk-sk'
  | 'sl-sl'
  | 'es-es'
  | 'es-es-dvorak'
  | 'sv-se'
  | 'tr-tr-f'
  | 'tr-tr-q'
  | 'en-us-colemak'
  | 'en-us-dvorak'
  | 'fr-fr-dvorak'
  | 'en-us-dvp'
  | 'en-us-norman'
  | 'en-us-workman'
  | 'en-us-zxcvm';

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

export const KEY_LABEL_LANGS: {
  labelLang: KeyboardLabelLang;
  keyLabels: KeyLabel[];
  menuLabel: string;
}[] = [
  {
    labelLang: 'en-ca',
    keyLabels: genKeyLabels(KeyLabelCanadian_multilingual),
    menuLabel: 'Canadian Multilingual (CSA)',
  },
  {
    labelLang: 'hr-hr',
    keyLabels: genKeyLabels(KeyLabelCroatian),
    menuLabel: 'Croatian',
  },
  {
    labelLang: 'cs-cz',
    keyLabels: genKeyLabels(KeyLabelCzech),
    menuLabel: 'Czech',
  },
  {
    labelLang: 'da-dk',
    keyLabels: genKeyLabels(KeyLabelDanish),
    menuLabel: 'Danish',
  },
  {
    labelLang: 'nl-be',
    keyLabels: genKeyLabels(KeyLabelBelgian),
    menuLabel: 'Dutch (Belgium)',
  },
  {
    labelLang: 'en-ie',
    keyLabels: genKeyLabels(KeyLabelIrish),
    menuLabel: 'English (Ireland)',
  },
  {
    labelLang: 'en-us',
    keyLabels: genKeyLabels(KeyLabelUs),
    menuLabel: 'English (US)',
  },
  {
    labelLang: 'en-gb',
    keyLabels: genKeyLabels(KeyLabelUk),
    menuLabel: 'English (UK)',
  },
  {
    labelLang: 'en-us-int',
    keyLabels: genKeyLabels(KeyLabelUs_international),
    menuLabel: 'English (US International)',
  },
  {
    labelLang: 'et-ee',
    keyLabels: genKeyLabels(KeyLabelEstonian),
    menuLabel: 'Estonian',
  },
  {
    labelLang: 'fi-fi',
    keyLabels: genKeyLabels(KeyLabelFinnish),
    menuLabel: 'Finnish',
  },
  {
    labelLang: 'fr-fr',
    keyLabels: genKeyLabels(KeyLabelFrench),
    menuLabel: 'French',
  },
  {
    labelLang: 'fr-fr-afnor',
    keyLabels: genKeyLabels(KeyLabelFrench_afnor),
    menuLabel: 'French (AFNOR)',
  },
  {
    labelLang: 'fr-fr-bepo',
    keyLabels: genKeyLabels(KeyLabelBepo),
    menuLabel: 'French (BÉPO)',
  },
  {
    labelLang: 'fr-be',
    keyLabels: genKeyLabels(KeyLabelBelgian),
    menuLabel: 'French (Belgium)',
  },
  {
    labelLang: 'fr-ch',
    keyLabels: genKeyLabels(KeyLabelFr_ch),
    menuLabel: 'French (Switzerland)',
  },
  {
    labelLang: 'fr-fr-mac',
    keyLabels: genKeyLabels(KeyLabelFrench_osx),
    menuLabel: 'French (macOS, ISO)',
  },
  {
    labelLang: 'de-de',
    keyLabels: genKeyLabels(KeyLabelGerman),
    menuLabel: 'German',
  },
  {
    labelLang: 'de-ch',
    keyLabels: genKeyLabels(KeyLabelGerman_ch),
    menuLabel: 'German (Switzerland)',
  },
  {
    labelLang: 'de-de-mac',
    keyLabels: genKeyLabels(KeyLabelGerman_osx),
    menuLabel: 'German (macOS)',
  },
  {
    labelLang: 'de-de-neo2',
    keyLabels: genKeyLabels(KeyLabelNeo2),
    menuLabel: 'German (Neo2)',
  },
  {
    labelLang: 'el-gr',
    keyLabels: genKeyLabels(KeyLabelGreek),
    menuLabel: 'Greek',
  },
  {
    labelLang: 'he-il',
    keyLabels: genKeyLabels(KeyLabelHebrew),
    menuLabel: 'Hebrew',
  },
  {
    labelLang: 'hu-hu',
    keyLabels: genKeyLabels(KeyLabelHungarian),
    menuLabel: 'Hungarian',
  },
  {
    labelLang: 'is-is',
    keyLabels: genKeyLabels(KeyLabelIcelandic),
    menuLabel: 'Icelandic',
  },
  {
    labelLang: 'it-it',
    keyLabels: genKeyLabels(KeyLabelItalian),
    menuLabel: 'Italian',
  },
  {
    labelLang: 'it-it-mac-ansi',
    keyLabels: genKeyLabels(KeyLabelItalian_osx_ansi),
    menuLabel: 'Italian (macOS, ANSI)',
  },
  {
    labelLang: 'it-it-mac-iso',
    keyLabels: genKeyLabels(KeyLabelItalian_osx_iso),
    menuLabel: 'Italian (macOS, ISO)',
  },
  {
    labelLang: 'ja-jp',
    keyLabels: genKeyLabels(KeyLabelJp),
    menuLabel: 'Japanese',
  },
  {
    labelLang: 'ko-kr',
    keyLabels: genKeyLabels(KeyLabelKorean),
    menuLabel: 'Korean',
  },
  {
    labelLang: 'lv-lv',
    keyLabels: genKeyLabels(KeyLabelLatvian),
    menuLabel: 'Latvian',
  },
  {
    labelLang: 'lt-lt-azerty',
    keyLabels: genKeyLabels(KeyLabelLithuanian_azerty),
    menuLabel: 'Lithuanian (ĄŽERTY)',
  },
  {
    labelLang: 'lt-lt-qwertz',
    keyLabels: genKeyLabels(KeyLabelLithuanian_qwerty),
    menuLabel: 'Lithuanian (QWERTY)',
  },
  {
    labelLang: 'nb-no',
    keyLabels: genKeyLabels(KeyLabelNorwegian),
    menuLabel: 'Norwegian',
  },
  {
    labelLang: 'pl-pl',
    keyLabels: genKeyLabels(KeyLabelPolish),
    menuLabel: 'Polish',
  },
  {
    labelLang: 'pt-pt',
    keyLabels: genKeyLabels(KeyLabelPortuguese),
    menuLabel: 'Portuguese',
  },
  {
    labelLang: 'pt-pt-mac',
    keyLabels: genKeyLabels(KeyLabelPortuguese_osx_iso),
    menuLabel: 'Portuguese (macOS, ISO)',
  },
  {
    labelLang: 'pt-br',
    keyLabels: genKeyLabels(KeyLabelBr_abnt2),
    menuLabel: 'Portuguese (Brazil)',
  },
  {
    labelLang: 'ro-ro',
    keyLabels: genKeyLabels(KeyLabelRomanian),
    menuLabel: 'Romanian',
  },
  {
    labelLang: 'ru-ru',
    keyLabels: genKeyLabels(KeyLabelRussian),
    menuLabel: 'Russian',
  },
  {
    labelLang: 'sr-sp',
    keyLabels: genKeyLabels(KeyLabelSerbian),
    menuLabel: 'Serbian',
  },
  {
    labelLang: 'sr-sp-latin',
    keyLabels: genKeyLabels(KeyLabelSerbian_latin),
    menuLabel: 'Serbian (Latin)',
  },
  {
    labelLang: 'sk-sk',
    keyLabels: genKeyLabels(KeyLabelSlovak),
    menuLabel: 'Slovak',
  },
  {
    labelLang: 'sl-sl',
    keyLabels: genKeyLabels(KeyLabelSlovenian),
    menuLabel: 'Slovenian',
  },
  {
    labelLang: 'es-es',
    keyLabels: genKeyLabels(KeyLabelSpanish),
    menuLabel: 'Spanish',
  },
  {
    labelLang: 'es-es-dvorak',
    keyLabels: genKeyLabels(KeyLabelSpanish_dvorak),
    menuLabel: 'Spanish (Dvorak)',
  },
  {
    labelLang: 'sv-se',
    keyLabels: genKeyLabels(KeyLabelSwedish),
    menuLabel: 'Swedish',
  },
  {
    labelLang: 'tr-tr-f',
    keyLabels: genKeyLabels(KeyLabelTurkish_f),
    menuLabel: 'Turkish (F)',
  },
  {
    labelLang: 'tr-tr-q',
    keyLabels: genKeyLabels(KeyLabelTurkish_q),
    menuLabel: 'Turkish (Q)',
  },
  {
    labelLang: 'en-us-colemak',
    keyLabels: genKeyLabels(KeyLabelColemak),
    menuLabel: 'Colemak',
  },
  {
    labelLang: 'en-us-dvorak',
    keyLabels: genKeyLabels(KeyLabelDvorak),
    menuLabel: 'Dvorak',
  },
  {
    labelLang: 'fr-fr-dvorak',
    keyLabels: genKeyLabels(KeyLabelDvorak_fr),
    menuLabel: 'Dvorak (French)',
  },
  {
    labelLang: 'en-us-dvp',
    keyLabels: genKeyLabels(KeyLabelDvp),
    menuLabel: 'Dvorak (Programmer)',
  },
  {
    labelLang: 'en-us-norman',
    keyLabels: genKeyLabels(KeyLabelNorman),
    menuLabel: 'Norman',
  },
  {
    labelLang: 'en-us-workman',
    keyLabels: genKeyLabels(KeyLabelWorkman),
    menuLabel: 'Workman',
  },
  {
    labelLang: 'en-us-zxcvm',
    keyLabels: genKeyLabels(KeyLabelWorkman_zxcvm),
    menuLabel: 'Workman (ZXCVM)',
  },
];

export class KeyLabelLangs {
  static readonly KeyLabelLangMenus: {
    labelLang: KeyboardLabelLang;
    menuLabel: string;
  }[] = KEY_LABEL_LANGS.map((kll) => {
    return {
      labelLang: kll.labelLang,
      menuLabel: kll.menuLabel,
    };
  });

  static getKeyLabels(labelLang: KeyboardLabelLang): KeyLabel[] {
    const keyLabels = KEY_LABEL_LANGS.find(
      (kll) => kll.labelLang === labelLang
    );
    if (keyLabels === undefined) {
      throw new Error(`Undeifned label language: ${labelLang}`);
    }
    return keyLabels!.keyLabels;
  }

  static getAllLabelLangs(): KeyboardLabelLang[] {
    return KEY_LABEL_LANGS.map((item) => item.labelLang);
  }

  static getLabelLangMenuLabel(labelLang: KeyboardLabelLang): string {
    const keyLabels = KEY_LABEL_LANGS.find(
      (kll) => kll.labelLang === labelLang
    );
    if (keyLabels === undefined) {
      throw new Error(`Undeifned label language: ${labelLang}`);
    }
    return keyLabels!.menuLabel;
  }

  static findKeyLabel(
    code: number,
    mods: number,
    labelLang: KeyboardLabelLang
  ): KeyLabel | undefined {
    const item = KEY_LABEL_LANGS.find((item) => item.labelLang === labelLang);
    if (item === undefined) {
      throw new Error(`Undefined label language: ${labelLang}`);
    }
    const keyLabel = item.keyLabels.find(
      (kl) =>
        kl.code === code && kl.meta && kl.meta.find((m) => m.modifiers === mods)
    );
    return keyLabel;
  }
}
