import { KeyInfo } from '../KeycodeInfoList';

export const CATEGORY_LABEL_BMP = 'BMP';
export const BMP_EXTENDED_MIN = 24096;
export const BMP_EXTENDED_MAX = 24127;

export const bmpKeyInfoList: KeyInfo[] = [
  {
    desc: 'Disable BLE HID sending',
    keycodeInfo: {
      code: 24064,
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
      code: 24065,
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
      code: 24066,
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
      code: 24067,
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
      code: 24068,
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
      code: 24069,
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
      code: 24070,
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
      code: 24071,
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
      code: 24072,
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
      code: 24073,
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
      code: 24074,
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
      code: 24075,
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
      code: 24076,
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
      code: 24077,
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
      code: 24078,
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
      code: 24079,
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
      code: 24080,
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
      code: 24081,
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
      code: 24082,
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
      code: 24083,
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
      code: 24084,
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
      code: 24085,
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
      code: 24086,
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
      code: 24087,
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
      code: 24088,
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
      code: 24089,
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
      code: 24090,
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
      code: 24091,
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
      code: 24092,
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
      code: 24093,
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
      code: 24094,
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
      code: 24095,
      name: {
        long: 'xKANA',
        short: 'xKANA',
      },
      label: 'xKANA',
      keywords: [],
    },
  },
  {
    desc: 'Extended keycode 0',
    keycodeInfo: {
      code: 24096,
      name: {
        long: 'EXTENDED0',
        short: 'Ex0',
      },
      label: 'Ex0',
      keywords: ['ex0'],
    },
  },
  {
    desc: 'Extended keycode 1',
    keycodeInfo: {
      code: 24097,
      name: {
        long: 'EXTENDED1',
        short: 'Ex1',
      },
      label: 'Ex1',
      keywords: ['ex1'],
    },
  },
  {
    desc: 'Extended keycode 2',
    keycodeInfo: {
      code: 24098,
      name: {
        long: 'EXTENDED2',
        short: 'Ex2',
      },
      label: 'Ex2',
      keywords: ['ex2'],
    },
  },
  {
    desc: 'Extended keycode 3',
    keycodeInfo: {
      code: 24099,
      name: {
        long: 'EXTENDED3',
        short: 'Ex3',
      },
      label: 'Ex3',
      keywords: ['ex3'],
    },
  },
  {
    desc: 'Extended keycode 4',
    keycodeInfo: {
      code: 24100,
      name: {
        long: 'EXTENDED4',
        short: 'Ex4',
      },
      label: 'Ex4',
      keywords: ['ex4'],
    },
  },
  {
    desc: 'Extended keycode 5',
    keycodeInfo: {
      code: 24101,
      name: {
        long: 'EXTENDED5',
        short: 'Ex5',
      },
      label: 'Ex5',
      keywords: ['ex5'],
    },
  },
  {
    desc: 'Extended keycode 6',
    keycodeInfo: {
      code: 24102,
      name: {
        long: 'EXTENDED6',
        short: 'Ex6',
      },
      label: 'Ex6',
      keywords: ['ex6'],
    },
  },
  {
    desc: 'Extended keycode 7',
    keycodeInfo: {
      code: 24103,
      name: {
        long: 'EXTENDED7',
        short: 'Ex7',
      },
      label: 'Ex7',
      keywords: ['ex7'],
    },
  },
  {
    desc: 'Extended keycode 8',
    keycodeInfo: {
      code: 24104,
      name: {
        long: 'EXTENDED8',
        short: 'Ex8',
      },
      label: 'Ex8',
      keywords: ['ex8'],
    },
  },
  {
    desc: 'Extended keycode 9',
    keycodeInfo: {
      code: 24105,
      name: {
        long: 'EXTENDED9',
        short: 'Ex9',
      },
      label: 'Ex9',
      keywords: ['ex9'],
    },
  },
  {
    desc: 'Extended keycode 10',
    keycodeInfo: {
      code: 24106,
      name: {
        long: 'EXTENDED10',
        short: 'Ex10',
      },
      label: 'Ex10',
      keywords: ['ex10'],
    },
  },
  {
    desc: 'Extended keycode 11',
    keycodeInfo: {
      code: 24107,
      name: {
        long: 'EXTENDED11',
        short: 'Ex11',
      },
      label: 'Ex11',
      keywords: ['ex11'],
    },
  },
  {
    desc: 'Extended keycode 12',
    keycodeInfo: {
      code: 24108,
      name: {
        long: 'EXTENDED12',
        short: 'Ex12',
      },
      label: 'Ex12',
      keywords: ['ex12'],
    },
  },
  {
    desc: 'Extended keycode 13',
    keycodeInfo: {
      code: 24109,
      name: {
        long: 'EXTENDED13',
        short: 'Ex13',
      },
      label: 'Ex13',
      keywords: ['ex13'],
    },
  },
  {
    desc: 'Extended keycode 14',
    keycodeInfo: {
      code: 24110,
      name: {
        long: 'EXTENDED14',
        short: 'Ex14',
      },
      label: 'Ex14',
      keywords: ['ex14'],
    },
  },
  {
    desc: 'Extended keycode 15',
    keycodeInfo: {
      code: 24111,
      name: {
        long: 'EXTENDED15',
        short: 'Ex15',
      },
      label: 'Ex15',
      keywords: ['ex15'],
    },
  },
  {
    desc: 'Extended keycode 16',
    keycodeInfo: {
      code: 24112,
      name: {
        long: 'EXTENDED16',
        short: 'Ex16',
      },
      label: 'Ex16',
      keywords: ['ex16'],
    },
  },
  {
    desc: 'Extended keycode 17',
    keycodeInfo: {
      code: 24113,
      name: {
        long: 'EXTENDED17',
        short: 'Ex17',
      },
      label: 'Ex17',
      keywords: ['ex17'],
    },
  },
  {
    desc: 'Extended keycode 18',
    keycodeInfo: {
      code: 24114,
      name: {
        long: 'EXTENDED18',
        short: 'Ex18',
      },
      label: 'Ex18',
      keywords: ['ex18'],
    },
  },
  {
    desc: 'Extended keycode 19',
    keycodeInfo: {
      code: 24115,
      name: {
        long: 'EXTENDED19',
        short: 'Ex19',
      },
      label: 'Ex19',
      keywords: ['ex19'],
    },
  },
  {
    desc: 'Extended keycode 20',
    keycodeInfo: {
      code: 24116,
      name: {
        long: 'EXTENDED20',
        short: 'Ex20',
      },
      label: 'Ex20',
      keywords: ['ex20'],
    },
  },
  {
    desc: 'Extended keycode 21',
    keycodeInfo: {
      code: 24117,
      name: {
        long: 'EXTENDED21',
        short: 'Ex21',
      },
      label: 'Ex21',
      keywords: ['ex21'],
    },
  },
  {
    desc: 'Extended keycode 22',
    keycodeInfo: {
      code: 24118,
      name: {
        long: 'EXTENDED22',
        short: 'Ex22',
      },
      label: 'Ex22',
      keywords: ['ex22'],
    },
  },
  {
    desc: 'Extended keycode 23',
    keycodeInfo: {
      code: 24119,
      name: {
        long: 'EXTENDED23',
        short: 'Ex23',
      },
      label: 'Ex23',
      keywords: ['ex23'],
    },
  },
  {
    desc: 'Extended keycode 24',
    keycodeInfo: {
      code: 24120,
      name: {
        long: 'EXTENDED24',
        short: 'Ex24',
      },
      label: 'Ex24',
      keywords: ['ex24'],
    },
  },
  {
    desc: 'Extended keycode 25',
    keycodeInfo: {
      code: 24121,
      name: {
        long: 'EXTENDED25',
        short: 'Ex25',
      },
      label: 'Ex25',
      keywords: ['ex25'],
    },
  },
  {
    desc: 'Extended keycode 26',
    keycodeInfo: {
      code: 24122,
      name: {
        long: 'EXTENDED26',
        short: 'Ex26',
      },
      label: 'Ex26',
      keywords: ['ex26'],
    },
  },
  {
    desc: 'Extended keycode 27',
    keycodeInfo: {
      code: 24123,
      name: {
        long: 'EXTENDED27',
        short: 'Ex27',
      },
      label: 'Ex27',
      keywords: ['ex27'],
    },
  },
  {
    desc: 'Extended keycode 28',
    keycodeInfo: {
      code: 24124,
      name: {
        long: 'EXTENDED28',
        short: 'Ex28',
      },
      label: 'Ex28',
      keywords: ['ex28'],
    },
  },
  {
    desc: 'Extended keycode 29',
    keycodeInfo: {
      code: 24125,
      name: {
        long: 'EXTENDED29',
        short: 'Ex29',
      },
      label: 'Ex29',
      keywords: ['ex29'],
    },
  },
  {
    desc: 'Extended keycode 30',
    keycodeInfo: {
      code: 24126,
      name: {
        long: 'EXTENDED30',
        short: 'Ex30',
      },
      label: 'Ex30',
      keywords: ['ex30'],
    },
  },
  {
    desc: 'Extended keycode 31',
    keycodeInfo: {
      code: 24127,
      name: {
        long: 'EXTENDED31',
        short: 'Ex31',
      },
      label: 'Ex31',
      keywords: ['ex31'],
    },
  },
];
