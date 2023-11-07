import { KeyInfo } from './KeycodeInfoList';

export const CATEGORY_LABEL_BMP = 'BMP';

export const bmpKeyInfoList: KeyInfo[] = [
  {
    desc: 'Enable BLE and disable USB',
    keycodeInfo: {
      code: 0x7e00,
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
      code: 0x7e01,
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
      code: 0x7e02,
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
      code: 0x7e03,
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
      code: 0x7e04,
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
      code: 0x7e05,
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
      code: 0x7e06,
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
      code: 0x7e07,
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
      code: 0x7e08,
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
      code: 0x7e09,
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
      code: 0x7e0a,
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
      code: 0x7e0b,
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
      code: 0x7e0c,
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
      code: 0x7e0d,
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
      code: 0x7e0e,
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
      code: 0x7e0f,
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
      code: 0x7e10,
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
      code: 0x7e11,
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
      code: 0x7e12,
      name: {
        long: 'DELBNDS',
        short: 'DELBNDS',
      },
      label: 'DELBNDS',
      keywords: [],
    },
  },
  {
    desc: 'Display battery level in milli volts',
    keycodeInfo: {
      code: 0x7e13,
      name: {
        long: 'BATT_LV',
        short: 'BATT_LV',
      },
      label: 'BATT LV',
      keywords: ['batt_lv'],
    },
  },
  {
    desc: 'Deep sleep mode',
    keycodeInfo: {
      code: 0x7e14,
      name: {
        long: 'ENT_SLP',
        short: 'ENT_SLP',
      },
      label: 'ENT SLP',
      keywords: ['ent_slp'],
    },
  },
  {
    desc: 'Disable key override for US/JP keyboard on JP/US OS',
    keycodeInfo: {
      code: 0x7e15,
      name: {
        long: 'DISABLE_KEY_OS_OVERRIDE',
        short: 'D_OVR',
      },
      label: 'D OVR',
      keywords: ['Disable keyboard os override'],
    },
  },
  {
    desc: 'Enable US keyboard on JP OS override',
    keycodeInfo: {
      code: 0x7e16,
      name: {
        long: 'ENABLE_US_KEY_ON_JP_OS_OVERRIDE',
        short: 'UJ_OVR',
      },
      label: 'UJ OVR',
      keywords: ['Enable US keyboard on JP OS override'],
    },
  },
  {
    desc: 'Enable JP keyboard on US OS override',
    keycodeInfo: {
      code: 0x7e17,
      name: {
        long: 'ENABLE_JP_KEY_ON_US_OS_OVERRIDE',
        short: 'JU_OVR',
      },
      label: 'JU OVR',
      keywords: ['Enable JP keyboard on US OS override'],
    },
  },
];
