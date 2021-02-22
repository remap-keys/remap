import { connect } from 'react-redux';
import KeycodeKey, { AnyKey, KeycodeKeyOwnProps } from './KeycodeKey';
import { RootState } from '../../../store/state';
import {
  AnyKeycodeKeyActions,
  KeycodeKeyActions,
} from '../../../actions/actions';
import { IKeycodeInfo, IKeymap } from '../../../services/hid/Hid';
import { hexadecimal } from '../../../utils/StringUtils';

export type Key = {
  label: string;
  meta: string;
  keymap: IKeymap;
};

type KEYBOARD_LOCALE = 'us' | 'jis';

type KeyTop = {
  label: string;
  meta: string;
};
const getKeytop = (
  code: number,
  defaultLabel: string,
  locale: KEYBOARD_LOCALE = 'us'
): KeyTop => {
  const dict = [
    { code: 30, label: '1', meta: '!' }, //0x1E
    { code: 31, label: '2', meta: '@' }, //0x1F
    { code: 32, label: '3', meta: '#' }, //0x20
    { code: 33, label: '4', meta: '$' }, //0x21
    { code: 34, label: '5', meta: '%' }, //0x22
    { code: 35, label: '6', meta: '^' }, //0x23
    { code: 36, label: '7', meta: '&' }, //0x24
    { code: 37, label: '8', meta: '*' }, //0x25
    { code: 38, label: '9', meta: '(' }, //0x26
    { code: 39, label: '0', meta: ')' }, //0x27
    { code: 45, label: '-', meta: '_' }, //0x2D
    { code: 46, label: '=', meta: '+' }, //0x2E

    { code: 49, label: '\\', meta: '|' }, //0x31
    { code: 51, label: ';', meta: ':' }, //0x33
    { code: 52, label: "'", meta: '"' }, //0x34
    { code: 54, label: ',', meta: '<' }, //0x36
    { code: 55, label: '.', meta: '>' }, //0x37
    { code: 56, label: '/', meta: '?' }, //0x38
    { code: 542, label: '!', meta: '(*S+1)' },
    { code: 543, label: '@', meta: '(*S+2)' },
    { code: 544, label: '#', meta: '(*S+3)' },
    { code: 545, label: '$', meta: '(*S+4)' },
    { code: 546, label: '%', meta: '(*S+5)' },
    { code: 547, label: '^', meta: '(*S+6)' },
    { code: 548, label: '&', meta: '(*S+7)' },
    { code: 549, label: '*', meta: '(*S+8)' },
    { code: 550, label: '(', meta: '(*S+9)' },
    { code: 551, label: ')', meta: '(*S+0)' },
    { code: 557, label: '_', meta: '(*S+-)' },
    { code: 558, label: '+', meta: '(*S+=)' },

    { code: 561, label: '|', meta: '(*S+\\)' },
    { code: 563, label: ':', meta: '(*S+;)' },
    { code: 564, label: '"', meta: "(*S+')" },
    { code: 566, label: '<', meta: '(*S+,)' },
    { code: 567, label: '>', meta: '(*S+.)' },
    { code: 568, label: '?', meta: '(*S+/)' },
  ];
  const item = dict.find((item) => item.code === code);
  return {
    label: item ? item.label : defaultLabel,
    meta: item ? item.meta : '',
  };
};

export const genKey = (keymap: IKeymap): Key => {
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
    const keytop: KeyTop = getKeytop(keymap.code, keymap.keycodeInfo!.label);
    return { label: keytop.label, meta: keytop.meta, keymap };
  }
};

export class KeycodeInfo implements IKeycodeInfo {
  readonly code: number;
  readonly name: { long: string; short: string };
  readonly label: string;
  constructor(label: string, code: number) {
    this.code = code;
    this.name = {
      long: label,
      short: label,
    };
    this.label = label;
  }
}

const mapStateToProps = (state: RootState, ownProps: KeycodeKeyOwnProps) => {
  return {
    keymaps: state.entities.device.keymaps,
    selectedLayer: state.configure.keymap.selectedLayer,
    selected: state.configure.keycodeKey.selectedKey == ownProps.value,
  };
};
export type KeycodeKeyStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    selectKey: (key: Key) => {
      _dispatch(KeycodeKeyActions.updateSelectedKey(key));
    },
    hoverKey: (key: Key | null) => {
      _dispatch(KeycodeKeyActions.updateHoverKey(key));
    },
    startDraggingKeycode: (key: Key) => {
      _dispatch(KeycodeKeyActions.updateDraggingKey(key));
    },
    endDraggingKeycode: () => {
      _dispatch(KeycodeKeyActions.updateDraggingKey(null));
    },
    updateAnyKey: (index: number, anyKey: AnyKey) => {
      _dispatch(AnyKeycodeKeyActions.updateAnyKey(index, anyKey));
    },
  };
};
export type KeycodeKeyActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeycodeKey);
