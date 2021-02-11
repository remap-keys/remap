type T = {
  code: number;
  label: string;
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
    label: 'Reset',
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
    label: 'DEBUG',
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
    label: 'CL SWAP',
    desc: 'Swap Caps Lock and Left Control.',
    keycodeInfo: {
      code: 23554,
      name: {
        long: 'MAGIC_SWAP_CONTROL_CAPSLOCK',
        short: 'CL_SWAP',
      },
      label: 'MAGIC_SWAP_CONTROL_CAPSLOCK',
    },
  },
  {
    code: 23555,
    label: 'CL CTRL',
    desc: 'Treat Caps Lock as Control.',
    keycodeInfo: {
      code: 23555,
      name: {
        long: 'MAGIC_CAPSLOCK_TO_CONTROL',
        short: 'CL_CTRL',
      },
      label: 'MAGIC_CAPSLOCK_TO_CONTROL',
    },
  },
  {
    code: 23556,
    label: 'LAG SWP',
    desc: 'Swap Left Alt and GUI.',
    keycodeInfo: {
      code: 23556,
      name: {
        long: 'MAGIC_SWAP_LALT_LGUI',
        short: 'LAG_SWP',
      },
      label: 'MAGIC_SWAP_LALT_LGUI',
    },
  },
  {
    code: 23557,
    label: 'RAG SWP',
    desc: 'Swap Right Alt and GUI.',
    keycodeInfo: {
      code: 23557,
      name: {
        long: 'MAGIC_SWAP_RALT_RGUI',
        short: 'RAG_SWP',
      },
      label: 'MAGIC_SWAP_RALT_RGUI',
    },
  },

  {
    code: 23558,
    label: 'GUI OFF',
    desc: 'Disable the GUI keys.',
    keycodeInfo: {
      code: 23558,
      name: {
        long: 'MAGIC_NO_GUI',
        short: 'GUI_OFF',
      },
      label: 'MAGIC_NO_GUI',
    },
  },

  {
    code: 23559,
    label: 'GE SWAP',
    desc: 'Swap ` and Escape.',
    keycodeInfo: {
      code: 23559,
      name: {
        long: 'MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      label: 'MAGIC_SWAP_GRAVE_ESC',
    },
  },
  {
    code: 23560,
    label: 'BS SWAP',
    desc: 'Swap  and Backspace.',
    keycodeInfo: {
      code: 23560,
      name: {
        long: 'MAGIC_SWAP_BACKSLASH_BACKSPACE',
        short: 'BS_SWAP',
      },
      label: 'MAGIC_SWAP_BACKSLASH_BACKSPACE',
    },
  },
  {
    code: 23561,
    label: 'NK ON',
    desc: 'Enable N-key rollover.',
    keycodeInfo: {
      code: 23561,
      name: {
        long: 'MAGIC_HOST_NKRO',
        short: 'NK_ON',
      },
      label: 'MAGIC_HOST_NKRO',
    },
  },
  {
    code: 23562,
    label: 'AG SWAP',
    desc: 'Swap Alt and Win/Cmd on both sides.',
    keycodeInfo: {
      code: 23562,
      name: {
        long: 'MAGIC_SWAP_ALT_GUI',
        short: 'AG_SWAP',
      },
      label: 'MAGIC_SWAP_ALT_GUI',
    },
  },
  {
    code: 23563,
    label: 'CL NORM',
    desc: 'Unswap Caps Lock and Left Control.',
    keycodeInfo: {
      code: 23563,
      name: {
        long: 'MAGIC_UNSWAP_CONTROL_CAPSLOCK',
        short: 'CL_NORM',
      },
      label: 'MAGIC_UNSWAP_CONTROL_CAPSLOCK',
    },
  },

  {
    code: 23564,
    label: 'CL CAPS',
    desc: 'Stop treating Caps Lock as Control.',
    keycodeInfo: {
      code: 23564,
      name: {
        long: 'MAGIC_UNCAPSLOCK_TO_CONTROL',
        short: 'CL_CAPS',
      },
      label: 'MAGIC_UNCAPSLOCK_TO_CONTROL',
    },
  },

  {
    code: 23565,
    label: 'LAG NRM',
    desc: 'Unswap Left Alt and Win/Cmd.',
    keycodeInfo: {
      code: 23565,
      name: {
        long: 'MAGIC_UNSWAP_LALT_LGUI',
        short: 'LAG_NRM',
      },
      label: 'MAGIC_UNSWAP_LALT_LGUI',
    },
  },

  {
    code: 23566,
    label: 'RAG NRM',
    desc: 'Unswap Right Alt and Win/Cmd.',
    keycodeInfo: {
      code: 23566,
      name: {
        long: 'MAGIC_UNSWAP_RALT_RGUI',
        short: 'RAG_NRM',
      },
      label: 'MAGIC_UNSWAP_RALT_RGUI',
    },
  },
  {
    code: 23567,
    label: 'GUI ON',
    desc: 'Enable the Win/Cmd keys.',
    keycodeInfo: {
      code: 23567,
      name: {
        long: 'MAGIC_UNNO_GUI',
        short: 'GUI_ON',
      },
      label: 'MAGIC_UNNO_GUI',
    },
  },

  {
    code: 23568,
    label: 'GE NORM',
    desc: 'Unswap ` and Escape.',
    keycodeInfo: {
      code: 23568,
      name: {
        long: 'MAGIC_SWAP_GRAVE_ESC',
        short: 'GE_SWAP',
      },
      label: 'MAGIC_SWAP_GRAVE_ESC',
    },
  },

  {
    code: 23569,
    label: 'BS NORM',
    desc: 'Unswap  and Backspace.',
    keycodeInfo: {
      code: 23569,
      name: {
        long: 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE',
        short: 'BS_NORM',
      },
      label: 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE',
    },
  },
  {
    code: 23570,
    label: 'NK OFF',
    desc: 'Disable N-key rollover.',
    keycodeInfo: {
      code: 23570,
      name: {
        long: 'MAGIC_UNHOST_NKRO',
        short: 'NK_OFF',
      },
      label: 'MAGIC_UNHOST_NKRO',
    },
  },
  {
    code: 23571,
    label: 'AG NORM',
    desc: 'Unswap Alt and GUI on both sides.',
    keycodeInfo: {
      code: 23571,
      name: {
        long: 'MAGIC_UNSWAP_ALT_GUI',
        short: 'AG_NORM',
      },
      label: 'MAGIC_UNSWAP_ALT_GUI',
    },
  },
  {
    code: 23572,
    label: 'NK TOGG',
    desc: 'Toggle N-key rollover.',
    keycodeInfo: {
      code: 23572,
      name: {
        long: 'MAGIC_TOGGLE_NKRO',
        short: 'NK_TOGG',
      },
      label: 'Toggle NKRO',
    },
  },
  {
    code: 23573,
    label: 'AG TOGG',
    desc: 'Toggle Alt and Win/Cmd swap on both sides.',
    keycodeInfo: {
      code: 23573,
      name: {
        long: 'MAGIC_TOGGLE_ALT_GUI',
        short: 'AG_TOGG',
      },
      label: 'MAGIC_TOGGLE_ALT_GUI',
    },
  },
  {
    code: 23574,
    label: 'GRAVE ESC',
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
    label: 'Audio on',
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
    label: 'Audio Off',
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
    label: 'Audio Toggle',
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
    label: '',
    desc: '',
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
    label: '',
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
    label: '',
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
    label: 'Clicky Up',
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
    label: 'Clicky Down',
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
    label: 'Clicky Reset',
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
    label: 'Music On',
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
    label: 'Music Off',
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
    label: 'Music Toggle',
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
    label: 'Music Mode',
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
    label: 'BL On',
    desc: '',
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
    label: 'BL Off',
    desc: '',
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
    label: 'BL -',
    desc: '',
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
    label: 'BL +',
    desc: '',
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
    label: 'BL Toggle',
    desc: '',
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
    label: 'BL Cycle',
    desc: '',
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
    label: 'BR Toggle',
    desc: '',
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
    label: 'RGB Toggle',
    desc: '',
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
    label: 'RGB Mode +',
    desc: '',
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
    label: 'RGB Mode -',
    desc: '',
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
    label: 'Hue +',
    desc: '',
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
    label: 'Hue -',
    desc: '',
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
    label: 'Sat +',
    desc: '',
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
    label: 'Sat -',
    desc: '',
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
    label: 'Bright +',
    desc: '',
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
    label: 'Bright -',
    desc: '',
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
    label: 'Effect Speed +',
    desc: '',
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
    label: 'Effect Speed -',
    desc: '',
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
    label: 'RGB Mode P',
    desc: '',
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
    label: 'RGB Mode B',
    desc: '',
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
    label: 'RGB Mode R',
    desc: '',
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
    label: 'RGB Mode SW',
    desc: '',
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
    label: 'RGB Mode SN',
    desc: '',
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
    label: 'RGB Mode K',
    desc: '',
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
    label: 'RGB Mode X',
    desc: '',
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
    label: 'RGB Mode G',
    desc: '',
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
    label: 'LS (',
    desc: '',
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
    label: 'RS )',
    desc: '',
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
    label: 'SftEnt',
    desc: '',
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
    label: 'LC (',
    desc: '',
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
    label: 'RC )',
    desc: '',
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
    label: 'LA (',
    desc: '',
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
    label: 'RA )',
    desc: '',
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
    label: 'Fn1 (Fn3)',
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
    label: 'Fn2 (Fn3)',
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
    label: 'M0',
    desc: '',
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
    label: 'M1',
    desc: '',
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
    label: 'M2',
    desc: '',
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
    label: 'M3',
    desc: '',
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
    label: 'M4',
    desc: '',
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
    label: 'M5',
    desc: '',
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
    label: 'M6',
    desc: '',
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
    label: 'M7',
    desc: '',
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
    label: 'M8',
    desc: '',
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
    label: 'M9',
    desc: '',
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
    label: 'M10',
    desc: '',
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
    label: 'M11',
    desc: '',
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
    label: 'M12',
    desc: '',
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
    label: 'M13',
    desc: '',
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
    label: 'M14',
    desc: '',
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
    label: 'M15',
    desc: '',
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
