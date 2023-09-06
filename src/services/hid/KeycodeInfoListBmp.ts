import { KeyInfo } from './KeycodeInfoList';

export const CATEGORY_LABEL_BMP = 'BMP';

export const bmpKeyInfoList: KeyInfo[] = [
  {
    desc: 'Disable BLE HID sending',
    keycodeInfo: {
      code: 0x5e00, // 24064 0b101111000000000
      name: {
        long: 'BLE_DIS',
        short: 'BLE_DIS',
      },
      label: 'BLE DIS',
      keywords: ['ble_dis'],
    },
  },
  {
    desc: 'Enable BLE HID sending',
    keycodeInfo: {
      code: 0x5e01, // 24065 0b101111000000001
      name: {
        long: 'BLE_EN',
        short: 'BLE_EN',
      },
      label: 'BLE EN',
      keywords: ['ble_en'],
    },
  },
  {
    desc: 'Disable USB HID sending',
    keycodeInfo: {
      code: 0x5e02, // 24066 0b101111000000010
      name: {
        long: 'USB_DIS',
        short: 'USB_DIS',
      },
      label: 'USB DIS',
      keywords: ['usb_dis'],
    },
  },
  {
    desc: 'Enable USB HID sending',
    keycodeInfo: {
      code: 0x5e03, // 24067 0b101111000000011
      name: {
        long: 'USB_EN',
        short: 'USB_EN',
      },
      label: 'USB EN',
      keywords: ['usb_en'],
    },
  },
  {
    desc: 'Enable BLE and disable USB',
    keycodeInfo: {
      code: 0x5e04, // 24068 0b101111000000100
      name: {
        long: 'SEL_BLE',
        short: 'SEL_BLE',
      },
      label: 'SEL BLE',
      keywords: ['sel_ble'],
    },
  },
  {
    desc: 'Enable USB and disable BLE',
    keycodeInfo: {
      code: 0x5e05, // 24069 0b101111000000101
      name: {
        long: 'SEL_USB',
        short: 'SEL_USB',
      },
      label: 'SEL USB',
      keywords: ['sel_usb'],
    },
  },
  {
    desc: 'Start advertising to PeerID 0',
    keycodeInfo: {
      code: 0x5e06, // 24070 0b101111000000110
      name: {
        long: 'ADV_ID0',
        short: 'ADV_ID0',
      },
      label: 'ADV ID0',
      keywords: ['adv_id0'],
    },
  },
  {
    desc: 'Start advertising to PeerID 1',
    keycodeInfo: {
      code: 0x5e07, // 24071 0b101111000000111
      name: {
        long: 'ADV_ID1',
        short: 'ADV_ID1',
      },
      label: 'ADV ID1',
      keywords: ['adv_id1'],
    },
  },
  {
    desc: 'Start advertising to PeerID 2',
    keycodeInfo: {
      code: 0x5e08, // 24072 0b101111000001000
      name: {
        long: 'ADV_ID2',
        short: 'ADV_ID2',
      },
      label: 'ADV ID2',
      keywords: ['adv_id2'],
    },
  },
  {
    desc: 'Start advertising to PeerID 3',
    keycodeInfo: {
      code: 0x5e09, // 24073 0b101111000001001
      name: {
        long: 'ADV_ID3',
        short: 'ADV_ID3',
      },
      label: 'ADV ID3',
      keywords: ['adv_id3'],
    },
  },
  {
    desc: 'Start advertising to PeerID 4',
    keycodeInfo: {
      code: 0x5e0a, // 24074 0b101111000001010
      name: {
        long: 'ADV_ID4',
        short: 'ADV_ID4',
      },
      label: 'ADV ID4',
      keywords: ['adv_id4'],
    },
  },
  {
    desc: 'Start advertising to PeerID 5',
    keycodeInfo: {
      code: 0x5e0b, // 24075 0b101111000001011
      name: {
        long: 'ADV_ID5',
        short: 'ADV_ID5',
      },
      label: 'ADV ID5',
      keywords: ['adv_id5'],
    },
  },
  {
    desc: 'Start advertising to PeerID 6',
    keycodeInfo: {
      code: 0x5e0c, // 24076 0b101111000001100
      name: {
        long: 'ADV_ID6',
        short: 'ADV_ID6',
      },
      label: 'ADV ID6',
      keywords: ['adv_id6'],
    },
  },
  {
    desc: 'Start advertising to PeerID 7',
    keycodeInfo: {
      code: 0x5e0d, // 24077 0b101111000001101
      name: {
        long: 'ADV_ID7',
        short: 'ADV_ID7',
      },
      label: 'ADV ID7',
      keywords: ['adv_id7'],
    },
  },
  {
    desc: 'Start advertising without whitelist',
    keycodeInfo: {
      code: 0x5e0e, // 24078 0b101111000001110
      name: {
        long: 'AD_WO_L',
        short: 'AD_WO_L',
      },
      label: 'AD WO L',
      keywords: ['ad_wo_l'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 0',
    keycodeInfo: {
      code: 0x5e0f, // 24079 0b101111000001111
      name: {
        long: 'DEL_ID0',
        short: 'DEL_ID0',
      },
      label: 'DEL ID0',
      keywords: ['del_id0'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 1',
    keycodeInfo: {
      code: 0x5e10, // 24080 0b101111000010000
      name: {
        long: 'DEL_ID1',
        short: 'DEL_ID1',
      },
      label: 'DEL ID1',
      keywords: ['del_id1'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 2',
    keycodeInfo: {
      code: 0x5e11, // 24081 0b101111000010001
      name: {
        long: 'DEL_ID2',
        short: 'DEL_ID2',
      },
      label: 'DEL ID2',
      keywords: ['del_id2'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 3',
    keycodeInfo: {
      code: 0x5e12, // 24082 0b101111000010010
      name: {
        long: 'DEL_ID3',
        short: 'DEL_ID3',
      },
      label: 'DEL ID3',
      keywords: ['del_id3'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 4',
    keycodeInfo: {
      code: 0x5e13, // 24083 0b101111000010011
      name: {
        long: 'DEL_ID4',
        short: 'DEL_ID4',
      },
      label: 'DEL ID4',
      keywords: ['del_id4'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 5',
    keycodeInfo: {
      code: 0x5e14, // 24084 0b101111000010100
      name: {
        long: 'DEL_ID5',
        short: 'DEL_ID5',
      },
      label: 'DEL ID5',
      keywords: ['del_id5'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 6',
    keycodeInfo: {
      code: 0x5e15, // 24085 0b101111000010101
      name: {
        long: 'DEL_ID6',
        short: 'DEL_ID6',
      },
      label: 'DEL ID6',
      keywords: ['del_id6'],
    },
  },
  {
    desc: 'Delete bonding of PeerID 7',
    keycodeInfo: {
      code: 0x5e16, // 24086 0b101111000010110
      name: {
        long: 'DEL_ID7',
        short: 'DEL_ID7',
      },
      label: 'DEL ID7',
      keywords: ['del_id7'],
    },
  },
  {
    desc: 'Delete all bonding',
    keycodeInfo: {
      code: 0x5e17, // 24087 0b101111000010111
      name: {
        long: 'DELBNDS',
        short: 'DELBNDS',
      },
      label: 'DELBNDS',
      keywords: [],
    },
  },
  {
    desc: 'Start bootloader',
    keycodeInfo: {
      code: 0x5e18, // 24088 0b101111000011000
      name: {
        long: 'ENT_DFU',
        short: 'ENT_DFU',
      },
      label: 'ENT DFU',
      keywords: ['ent_dfu'],
    },
  },
  {
    desc: 'Start web configurator',
    keycodeInfo: {
      code: 0x5e19, // 24089 0b101111000011001
      name: {
        long: 'ENT_WEB',
        short: 'ENT_WEB',
      },
      label: 'ENT WEB',
      keywords: ['ent_web'],
    },
  },
  {
    desc: 'Deep sleep mode',
    keycodeInfo: {
      code: 0x5e1a, // 24090 0b101111000011010
      name: {
        long: 'ENT_SLP',
        short: 'ENT_SLP',
      },
      label: 'ENT SLP',
      keywords: ['ent_slp'],
    },
  },
  {
    desc: 'Display battery level in milli volts',
    keycodeInfo: {
      code: 0x5e1b, // 24091 0b101111000011011
      name: {
        long: 'BATT_LV',
        short: 'BATT_LV',
      },
      label: 'BATT LV',
      keywords: ['batt_lv'],
    },
  },
  {
    desc: 'Save EEPROM emulation',
    keycodeInfo: {
      code: 0x5e1c, // 24092 0b101111000011100
      name: {
        long: 'SAVE_EE',
        short: 'SAVE_EE',
      },
      label: 'SAVE_EE',
      keywords: ['save_ee'],
    },
  },
  {
    desc: 'Delete EEPROM emulation',
    keycodeInfo: {
      code: 0x5e1d, // 24093 0b101111000011101
      name: {
        long: 'DEL_EE',
        short: 'DEL_EE',
      },
      label: 'DEL_EE',
      keywords: ['del_ee'],
    },
  },
  {
    desc: 'Send Alt+` or LANG1',
    keycodeInfo: {
      code: 0x5e1e, // 24094 0b101111000011110
      name: {
        long: 'xEISU',
        short: 'xEISU',
      },
      label: 'xEISU',
      keywords: [],
    },
  },
  {
    desc: 'Send Alt+` or LANG2',
    keycodeInfo: {
      code: 0x5e1f, // 24095 0b101111000011111
      name: {
        long: 'xKANA',
        short: 'xKANA',
      },
      label: 'xKANA',
      keywords: [],
    },
  },
];
