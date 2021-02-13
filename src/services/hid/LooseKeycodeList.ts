type T = {
  code: number;
  desc?: string;
  keycodeInfo: {
    code: number;
    name: { long: string; short: string };
    label: string;
  };
};
export const loosekeycodeList: T[] = [
  {
    code: 23552,
    desc: 'Put the keyboard into bootloader mode for flashing.',
    keycodeInfo: {
      code: 23552,
      name: {
        long: 'RESET',
        short: 'RESET',
      },
      label: 'Reset',
    },
  },
  {
    code: 23553,
    desc: 'Toggle debug mode.',
    keycodeInfo: {
      code: 23553,
      name: {
        long: 'DEBUG',
        short: 'DEBUG',
      },
      label: 'Debug',
    },
  },
  {
    code: 23554,
    desc: 'Swap Caps Lock and Left Control.',
    keycodeInfo: {
      code: 23554,
      name: {
        long: 'MAGIC_SWAP_CONTROL_CAPSLOCK',
        short: 'CL_SWAP',
      },
      label: 'CL SWAP',
    },
  },
  {
    code: 23555,
    desc: 'Treat Caps Lock as Control.',
    keycodeInfo: {
      code: 23555,
      name: {
        long: 'MAGIC_CAPSLOCK_TO_CONTROL',
        short: 'CL_CTRL',
      },
      label: 'CL CTRL',
    },
  },
  {
    code: 23556,
    desc: 'Swap Left Alt and GUI.',
    keycodeInfo: {
      code: 23556,
      name: {
        long: 'MAGIC_SWAP_LALT_LGUI',
        short: 'LAG_SWP',
      },
      label: 'LAG SWP',
    },
  },
  {
    code: 23557,
    desc: 'Swap Right Alt and GUI.',
    keycodeInfo: {
      code: 23557,
      name: {
        long: 'MAGIC_SWAP_RALT_RGUI',
        short: 'RAG_SWP',
      },
      label: 'RAG SWP',
    },
  },

  {
    code: 23558,
    desc: 'Disable the GUI keys.',
    keycodeInfo: {
      code: 23558,
      name: {
        long: 'MAGIC_NO_GUI',
        short: 'GUI_OFF',
      },
      label: 'GUI OFF',
    },
  },

  {
    code: 23559,
    desc: 'Swap ` and Escape.',
    keycodeInfo: {
      code: 23559,
      name: {
        long: 'MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      label: 'GE SWAP',
    },
  },
  {
    code: 23560,
    desc: 'Swap  and Backspace.',
    keycodeInfo: {
      code: 23560,
      name: {
        long: 'MAGIC_SWAP_BACKSLASH_BACKSPACE',
        short: 'BS_SWAP',
      },
      label: 'BS SWAP',
    },
  },
  {
    code: 23561,
    desc: 'Enable N-key rollover.',
    keycodeInfo: {
      code: 23561,
      name: {
        long: 'MAGIC_HOST_NKRO',
        short: 'NK_ON',
      },
      label: 'NK ON',
    },
  },
  {
    code: 23562,
    desc: 'Swap Alt and Win/Cmd on both sides.',
    keycodeInfo: {
      code: 23562,
      name: {
        long: 'MAGIC_SWAP_ALT_GUI',
        short: 'AG_SWAP',
      },
      label: 'AG SWAP',
    },
  },
  {
    code: 23563,
    desc: 'Unswap Caps Lock and Left Control.',
    keycodeInfo: {
      code: 23563,
      name: {
        long: 'MAGIC_UNSWAP_CONTROL_CAPSLOCK',
        short: 'CL_NORM',
      },
      label: 'CL NORM',
    },
  },

  {
    code: 23564,
    desc: 'Stop treating Caps Lock as Control.',
    keycodeInfo: {
      code: 23564,
      name: {
        long: 'MAGIC_UNCAPSLOCK_TO_CONTROL',
        short: 'CL_CAPS',
      },
      label: 'CL CAPS',
    },
  },

  {
    code: 23565,
    desc: 'Unswap Left Alt and Win/Cmd.',
    keycodeInfo: {
      code: 23565,
      name: {
        long: 'MAGIC_UNSWAP_LALT_LGUI',
        short: 'LAG_NRM',
      },
      label: 'LAG NRM',
    },
  },

  {
    code: 23566,
    desc: 'Unswap Right Alt and Win/Cmd.',
    keycodeInfo: {
      code: 23566,
      name: {
        long: 'MAGIC_UNSWAP_RALT_RGUI',
        short: 'RAG_NRM',
      },
      label: 'RAG NRM',
    },
  },
  {
    code: 23567,
    desc: 'Enable the Win/Cmd keys.',
    keycodeInfo: {
      code: 23567,
      name: {
        long: 'MAGIC_UNNO_GUI',
        short: 'GUI_ON',
      },
      label: 'GUI ON',
    },
  },

  {
    code: 23568,
    desc: 'Unswap ` and Escape.',
    keycodeInfo: {
      code: 23568,
      name: {
        long: 'MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      label: 'GE NORM',
    },
  },

  {
    code: 23569,
    desc: 'Unswap  and Backspace.',
    keycodeInfo: {
      code: 23569,
      name: {
        long: 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE',
        short: 'BS_NORM',
      },
      label: 'BS NORM',
    },
  },
  {
    code: 23570,
    desc: 'Disable N-key rollover.',
    keycodeInfo: {
      code: 23570,
      name: {
        long: 'MAGIC_UNHOST_NKRO',
        short: 'NK_OFF',
      },
      label: 'NK OFF',
    },
  },
  {
    code: 23571,
    desc: 'Unswap Alt and GUI on both sides.',
    keycodeInfo: {
      code: 23571,
      name: {
        long: 'MAGIC_UNSWAP_ALT_GUI',
        short: 'AG_NORM',
      },
      label: 'AG NORM',
    },
  },
  {
    code: 23572,
    desc: 'Toggle N-key rollover.',
    keycodeInfo: {
      code: 23572,
      name: {
        long: 'MAGIC_TOGGLE_NKRO',
        short: 'NK_TOGG',
      },
      label: 'NK TOGG',
    },
  },
  {
    code: 23573,

    desc: 'Toggle Alt and Win/Cmd swap on both sides.',
    keycodeInfo: {
      code: 23573,
      name: {
        long: 'MAGIC_TOGGLE_ALT_GUI',
        short: 'AG_TOGG',
      },
      label: 'AG TOGG',
    },
  },
  {
    code: 23574,
    desc: 'Share the grave key (` and ~) with Escape.',
    keycodeInfo: {
      code: 23574,
      name: {
        long: 'GRAVE_ESC',
        short: 'KC_GESC',
      },
      label: 'Esc `',
    },
  },
  {
    code: 23581,
    desc: 'Audio mode on.',
    keycodeInfo: {
      code: 23581,
      name: {
        long: 'AU_ON',
        short: 'AU_ON',
      },
      label: 'Audio On',
    },
  },
  {
    code: 23582,
    desc: 'Audio mode off.',
    keycodeInfo: {
      code: 23582,
      name: {
        long: 'AU_OFF',
        short: 'AU_OFF',
      },
      label: 'Audio Off',
    },
  },
  {
    code: 23583,
    desc: 'Toggles Audio mode.',
    keycodeInfo: {
      code: 23583,
      name: {
        long: 'AU_TOG',
        short: 'AU_TOG',
      },
      label: 'Audio Toggle',
    },
  },
  {
    code: 23584,
    desc: 'Toggles Audio clicky mode.',
    keycodeInfo: {
      code: 23584,
      name: {
        long: 'CLICKY_TOGGLE',
        short: 'CLICKY_TOGGLE',
      },
      label: 'Clicky Toggle',
    },
  },
  {
    code: 23585,
    desc: '',
    keycodeInfo: {
      code: 23585,
      name: {
        long: 'CLICKY_ENABLE',
        short: 'CLICKY_ENABLE',
      },
      label: 'Clicky Enable',
    },
  },
  {
    code: 23586,
    desc: '',
    keycodeInfo: {
      code: 23586,
      name: {
        long: 'CLICKY_DISABLE',
        short: 'CLICKY_DISABLE',
      },
      label: 'Clicky Disable',
    },
  },
  {
    code: 23587,
    desc: 'Increases frequency of the clicks.',
    keycodeInfo: {
      code: 23587,
      name: {
        long: 'CLICKY_UP',
        short: 'CLICKY_UP',
      },
      label: 'Clicky Up',
    },
  },
  {
    code: 23588,
    desc: 'Decreases frequency of the clicks.',
    keycodeInfo: {
      code: 23588,
      name: {
        long: 'CLICKY_DOWN',
        short: 'CLICKY_DOWN',
      },
      label: 'Clicky Down',
    },
  },
  {
    code: 23589,
    desc: 'Resets frequency to default.',
    keycodeInfo: {
      code: 23589,
      name: {
        long: 'CLICKY_RESET',
        short: 'CLICKY_RESET',
      },
      label: 'Clicky Reset',
    },
  },
  {
    code: 23590,
    desc: 'Turn music mode on.',
    keycodeInfo: {
      code: 23590,
      name: {
        long: 'MU_ON',
        short: 'MU_ON',
      },
      label: 'Music On',
    },
  },
  {
    code: 23591,
    desc: 'Music Toggle.',
    keycodeInfo: {
      code: 23591,
      name: {
        long: 'MU_OFF',
        short: 'MU_OFF',
      },
      label: 'Music Off',
    },
  },
  {
    code: 23592,
    desc: 'Toggle music mode.',
    keycodeInfo: {
      code: 23592,
      name: {
        long: 'MU_TOG',
        short: 'MU_TOG',
      },
      label: 'Music Toggle',
    },
  },
  {
    code: 23593,
    desc: 'Cycle through the music modes.',
    keycodeInfo: {
      code: 23593,
      name: {
        long: 'MU_MOD',
        short: 'MU_MOD',
      },
      label: 'Music Mode',
    },
  },

  {
    code: 23739,
    desc: 'Set the backlight to max brightness.',
    keycodeInfo: {
      code: 23739,
      name: {
        long: 'BL_ON',
        short: 'BL_ON',
      },
      label: 'BL On',
    },
  },

  {
    code: 23740,
    desc: 'Turn the backlight off.',
    keycodeInfo: {
      code: 23740,
      name: {
        long: 'BL_OFF',
        short: 'BL_OFF',
      },
      label: 'BL Off',
    },
  },

  {
    code: 23741,
    desc: 'Decrease the backlight level.',
    keycodeInfo: {
      code: 23741,
      name: {
        long: 'BL_DEC',
        short: 'BL_DEC',
      },
      label: 'BL -',
    },
  },

  {
    code: 23742,
    desc: 'Increase the backlight level.',
    keycodeInfo: {
      code: 23742,
      name: {
        long: 'BL_INC',
        short: 'BL_INC',
      },
      label: 'BL +',
    },
  },

  {
    code: 23743,
    desc: 'Turn the backlight on or off.',
    keycodeInfo: {
      code: 23743,
      name: {
        long: 'BL_TOGG',
        short: 'BL_TOGG',
      },
      label: 'BL Toggle',
    },
  },

  {
    code: 23744,
    desc: 'Cycle through backlight levels.',
    keycodeInfo: {
      code: 23744,
      name: {
        long: 'BL_STEP',
        short: 'BL_STEP',
      },
      label: 'BL Cycle',
    },
  },

  {
    code: 23745,
    desc: 'Toggle backlight breathing',
    keycodeInfo: {
      code: 23745,
      name: {
        long: 'BL_BRTG',
        short: 'BL_BRTG',
      },
      label: 'BR Toggle',
    },
  },

  {
    code: 23746,
    desc: 'Toggle RGB lighting on or off.',
    keycodeInfo: {
      code: 23746,
      name: {
        long: 'RGB_TOG',
        short: 'RGB_TOG',
      },
      label: 'RGB Toggle',
    },
  },

  {
    code: 23747,
    desc: 'Cycle through modes, reverse direction when Shift is held.',
    keycodeInfo: {
      code: 23747,
      name: {
        long: 'RGB_MODE_FORWARD',
        short: 'RGB_MODE_FORWARD',
      },
      label: 'RGB Mode +',
    },
  },

  {
    code: 23748,
    desc:
      'Cycle through modes in reverse, forward direction when Shift is held.',
    keycodeInfo: {
      code: 23748,
      name: {
        long: 'RGB_MODE_REVERSE',
        short: 'RGB_MODE_REVERSE',
      },
      label: 'RGB Mode -',
    },
  },

  {
    code: 23749,
    desc: 'Increase hue, decrease hue when Shift is held.',
    keycodeInfo: {
      code: 23749,
      name: {
        long: 'RGB_HUI',
        short: 'RGB_HUI',
      },
      label: 'Hue +',
    },
  },

  {
    code: 23750,
    desc: 'Decrease hue, increase hue when Shift is held.',
    keycodeInfo: {
      code: 23750,
      name: {
        long: 'RGB_HUD',
        short: 'RGB_HUD',
      },
      label: 'Hue -',
    },
  },

  {
    code: 23751,
    desc: 'Increase saturation, decrease saturation when Shift is held.',
    keycodeInfo: {
      code: 23751,
      name: {
        long: 'RGB_SAI',
        short: 'RGB_SAI',
      },
      label: 'Sat +',
    },
  },

  {
    code: 23752,
    desc: 'Decrease saturation, increase saturation when Shift is held.',
    keycodeInfo: {
      code: 23752,
      name: {
        long: 'RGB_SAD',
        short: 'RGB_SAD',
      },
      label: 'Sat -',
    },
  },

  {
    code: 23753,
    desc: 'Increase value (brightness), decrease value when Shift is held.',
    keycodeInfo: {
      code: 23753,
      name: {
        long: 'RGB_VAI',
        short: 'RGB_VAI',
      },
      label: 'Bright +',
    },
  },

  {
    code: 23754,
    desc: 'Decrease value (brightness), increase value when Shift is held.',
    keycodeInfo: {
      code: 23754,
      name: {
        long: 'RGB_VAD',
        short: 'RGB_VAD',
      },
      label: 'Bright -',
    },
  },

  {
    code: 23755,
    desc:
      'Increase effect speed (does not support eeprom yet), decrease speed when Shift is held.',
    keycodeInfo: {
      code: 23755,
      name: {
        long: 'RGB_SPI',
        short: 'RGB_SPI',
      },
      label: 'Effect Speed +',
    },
  },

  {
    code: 23756,
    desc:
      'Decrease effect speed (does not support eeprom yet), increase speed when Shift is held.',
    keycodeInfo: {
      code: 23756,
      name: {
        long: 'RGB_SPD',
        short: 'RGB_SPD',
      },
      label: 'Effect Speed -',
    },
  },

  {
    code: 23757,
    desc: 'Static (no animation) mode.',
    keycodeInfo: {
      code: 23757,
      name: {
        long: 'RGB_MODE_PLAIN',
        short: 'RGB_MODE_PLAIN',
      },
      label: 'RGB Mode P',
    },
  },

  {
    code: 23758,
    desc: 'Breathing animation mode.',
    keycodeInfo: {
      code: 23758,
      name: {
        long: 'RGB_MODE_BREATHE',
        short: 'RGB_MODE_BREATHE',
      },
      label: 'RGB Mode B',
    },
  },

  {
    code: 23759,
    desc: 'Rainbow animation mode.',
    keycodeInfo: {
      code: 23759,
      name: {
        long: 'RGB_MODE_RAINBOW',
        short: 'RGB_MODE_RAINBOW',
      },
      label: 'RGB Mode R',
    },
  },

  {
    code: 23760,
    desc: 'Swirl animation mode.',
    keycodeInfo: {
      code: 23760,
      name: {
        long: 'RGB_MODE_SWIRL',
        short: 'RGB_MODE_SWIRL',
      },
      label: 'RGB Mode SW',
    },
  },

  {
    code: 23761,
    desc: 'Snake animation mode.',
    keycodeInfo: {
      code: 23761,
      name: {
        long: 'RGB_MODE_SNAKE',
        short: 'RGB_MODE_SNAKE',
      },
      label: 'RGB Mode SN',
    },
  },

  {
    code: 23762,
    desc: '"Knight Rider" animation mode.',
    keycodeInfo: {
      code: 23762,
      name: {
        long: 'RGB_MODE_KNIGHT',
        short: 'RGB_MODE_KNIGHT',
      },
      label: 'RGB Mode K',
    },
  },

  {
    code: 23763,
    desc: 'Christmas animation mode.',
    keycodeInfo: {
      code: 23763,
      name: {
        long: 'RGB_MODE_XMAS',
        short: 'RGB_MODE_XMAS',
      },
      label: 'RGB Mode X',
    },
  },

  {
    code: 23764,
    desc: 'Static gradient animation mode.',
    keycodeInfo: {
      code: 23764,
      name: {
        long: 'RGB_MODE_GRADIENT',
        short: 'RGB_MODE_GRADIENT',
      },
      label: 'RGB Mode G',
    },
  },

  {
    code: 23767,
    desc: 'Left Shift when held, ( when tapped.',
    keycodeInfo: {
      code: 23767,
      name: {
        long: 'KC_LSPO',
        short: 'KC_LSPO',
      },
      label: 'LS (',
    },
  },

  {
    code: 23768,
    desc: 'Right Shift when held, ) when tapped.',
    keycodeInfo: {
      code: 23768,
      name: {
        long: 'KC_RSPC',
        short: 'KC_RSPC',
      },
      label: 'RS )',
    },
  },

  {
    code: 23769,
    desc: 'Right Shift when held, Enter when tapped.',
    keycodeInfo: {
      code: 23769,
      name: {
        long: 'KC_SFTENT',
        short: 'KC_SFTENT',
      },
      label: 'SftEnt',
    },
  },

  {
    code: 23795,
    desc: 'Left Control when held, ( when tapped',
    keycodeInfo: {
      code: 23795,
      name: {
        long: 'KC_LCPO',
        short: 'KC_LCPO',
      },
      label: 'LC (',
    },
  },

  {
    code: 23796,
    desc: 'Right Control when held, ) when tapped.',
    keycodeInfo: {
      code: 23796,
      name: {
        long: 'KC_RCPC',
        short: 'KC_RCPC',
      },
      label: 'RC )',
    },
  },

  {
    code: 23797,
    desc: 'Left Alt when held, ( when tapped.',
    keycodeInfo: {
      code: 23797,
      name: {
        long: 'KC_LAPO',
        short: 'KC_LAPO',
      },
      label: 'LA (',
    },
  },

  {
    code: 23798,
    desc: 'Right Alt when held, ) when tapped.',
    keycodeInfo: {
      code: 23798,
      name: {
        long: 'KC_RAPC',
        short: 'KC_RAPC',
      },
      label: 'RA )',
    },
  },

  {
    code: 24336,
    desc: '',
    keycodeInfo: {
      code: 24336,
      name: {
        long: 'FN_MO13',
        short: 'FN_MO13',
      },
      label: 'Fn1 (Fn3)',
    },
  },

  {
    code: 24337,
    desc: '',
    keycodeInfo: {
      code: 24337,
      name: {
        long: 'FN_MO23',
        short: 'FN_MO23',
      },
      label: 'Fn2 (Fn3)',
    },
  },

  {
    code: 24338,
    desc: 'Macro 0',
    keycodeInfo: {
      code: 24338,
      name: {
        long: 'MACRO00',
        short: 'M0',
      },
      label: 'M0',
    },
  },

  {
    code: 24339,
    desc: 'Macro 1',
    keycodeInfo: {
      code: 24339,
      name: {
        long: 'MACRO01',
        short: 'M1',
      },
      label: 'M1',
    },
  },

  {
    code: 24340,
    desc: 'Macro 2',
    keycodeInfo: {
      code: 24340,
      name: {
        long: 'MACRO02',
        short: 'M2',
      },
      label: 'M2',
    },
  },

  {
    code: 24341,
    desc: 'Macro 3',
    keycodeInfo: {
      code: 24341,
      name: {
        long: 'MACRO03',
        short: 'M3',
      },
      label: 'M3',
    },
  },

  {
    code: 24342,
    desc: 'Macro 4',
    keycodeInfo: {
      code: 24342,
      name: {
        long: 'MACRO04',
        short: 'M4',
      },
      label: 'M4',
    },
  },

  {
    code: 24343,
    desc: 'Macro 5',
    keycodeInfo: {
      code: 24343,
      name: {
        long: 'MACRO05',
        short: 'M5',
      },
      label: 'M5',
    },
  },

  {
    code: 24344,
    desc: 'Macro 6',
    keycodeInfo: {
      code: 24344,
      name: {
        long: 'MACRO06',
        short: 'M6',
      },
      label: 'M6',
    },
  },

  {
    code: 24345,
    desc: 'Macro 7',
    keycodeInfo: {
      code: 24345,
      name: {
        long: 'MACRO07',
        short: 'M7',
      },
      label: 'M7',
    },
  },

  {
    code: 24346,
    desc: 'Macro 8',
    keycodeInfo: {
      code: 24346,
      name: {
        long: 'MACRO08',
        short: 'M8',
      },
      label: 'M8',
    },
  },

  {
    code: 24347,
    desc: 'Macro 9',
    keycodeInfo: {
      code: 24347,
      name: {
        long: 'MACRO09',
        short: 'M9',
      },
      label: 'M9',
    },
  },

  {
    code: 24348,
    desc: 'Macro 10',
    keycodeInfo: {
      code: 24348,
      name: {
        long: 'MACRO10',
        short: 'M10',
      },
      label: 'M10',
    },
  },

  {
    code: 24349,
    desc: 'Macro 11',
    keycodeInfo: {
      code: 24349,
      name: {
        long: 'MACRO11',
        short: 'M11',
      },
      label: 'M11',
    },
  },

  {
    code: 24350,
    desc: 'Macro 12',
    keycodeInfo: {
      code: 24350,
      name: {
        long: 'MACRO12',
        short: 'M12',
      },
      label: 'M12',
    },
  },

  {
    code: 24351,
    desc: 'Macro 13',
    keycodeInfo: {
      code: 24351,
      name: {
        long: 'MACRO13',
        short: 'M13',
      },
      label: 'M13',
    },
  },

  {
    code: 24352,
    desc: 'Macro 14',
    keycodeInfo: {
      code: 24352,
      name: {
        long: 'MACRO14',
        short: 'M14',
      },
      label: 'M14',
    },
  },

  {
    code: 24353,
    desc: 'Macro 15',
    keycodeInfo: {
      code: 24353,
      name: {
        long: 'MACRO15',
        short: 'M15',
      },
      label: 'M15',
    },
  },
];
