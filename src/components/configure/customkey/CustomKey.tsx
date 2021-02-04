/* eslint-disable no-undef */
import React from 'react';
import './CustomKey.scss';
import Popover from '@material-ui/core/Popover';
import { AppBar, Tab, Tabs, TextField } from '@material-ui/core';
import { Key } from '../keycodekey/KeycodeKey.container';
import AutocompleteKeys from './AutocompleteKeys';
import Modifiers from './Modifiers';
import {
  IMod,
  IModDirection,
  KeycodeCompositionFactory,
} from '../../../services/hid/Composition';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import DualFunctionsKey from './DualFunctionsKey';
import { IKeymap } from '../../../services/hid/Hid';

type OwnProps = {
  id: string;
  value: Key;
  layerCount: number;
  open: boolean;
  anchorRef: React.RefObject<any> | null;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (newKey: Key) => void;
};

type OwnState = {
  selectedTabIndex: number;

  // Keys TAB
  value: KeycodeOption | null; // Keys
  modifiers: number; // 0b1_1111

  // 2 FUNCS TAB
  holdKey: KeycodeOption | null;
  tapKey: KeycodeOption | null;

  // Custom TAB
  label: string;
  hexCode: string; // support to show 001.
};

export default class CustomKey extends React.Component<OwnProps, OwnState> {
  arrowRef: React.RefObject<unknown>;
  basicKeymaps: IKeymap[];
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      value: null,
      holdKey: null,
      tapKey: null,
      modifiers: 0,
      selectedTabIndex: 0,
      label: '',
      hexCode: '',
    };
    this.arrowRef = React.createRef();
    this.basicKeymaps = KeycodeList.basicKeymaps;
  }

  get disabledModifiers() {
    const factory = new KeycodeCompositionFactory(
      parseInt(this.state.hexCode, 16)
    );
    return !(factory.isBasic() || factory.isMods());
  }

  private onEnter() {
    //TODO: initialize input status
    const keymap: KeycodeOption = this.props.value.keymap;
    this.setState({
      value: this.props.value.keymap,
      label: this.props.value.keymap.keycodeInfo!.label,
      hexCode: Number(keymap.code).toString(16),
    });
  }

  private emitKeyChange(args: {
    value?: KeycodeOption;
    label?: string;
    code?: number;
  }) {
    let label = args.label == undefined ? this.state.label : args.label;
    let code =
      args.code == undefined ? parseInt(this.state.hexCode, 16) : args.code;
    let value = this.state.value!;
    if (args.value) {
      label = args.value.keycodeInfo!.label;
      code = args.value.code;
      value = args.value;
    }

    const keymap: IKeymap = {
      ...value,
      keycodeInfo: { ...value.keycodeInfo!, ...{ label: label, code: code } },
    };

    const key: Key = {
      label: label,
      meta: '',
      keymap: keymap,
    };
    console.log(key);
    this.props.onChange(key);
  }

  private onChangeKeys(opt: KeycodeOption | null) {
    if (opt == null) {
      this.setState({ value: opt, label: '', hexCode: '' });
      return;
    }

    const factory = new KeycodeCompositionFactory(opt.code);
    if (factory.isBasic()) {
      const code = this.buildKeycodeWithModifier(
        opt.code,
        this.state.modifiers
      );
      this.setState({
        value: opt,
        label: opt.keycodeInfo!.label,
        hexCode: Number(code).toString(16),
      });
    } else {
      this.setState({
        value: opt,
        label: opt.keycodeInfo!.label,
        hexCode: Number(opt.code).toString(16),
      });
    }
  }

  private onChangeHexCode(value: string) {
    const hexCode = value
      .toUpperCase()
      .replace(/[^0-9,A-F]/g, '')
      .slice(0, 4);
    const code = parseInt(hexCode, 16);
    const factory = new KeycodeCompositionFactory(code);
    if (factory.isBasic() || factory.isMods()) {
      const keycode = code & 0x00ff;
      const keymap = KeycodeList.getKeymap(keycode);
      if (!keymap.isAny) {
        const modCode = (code & 0xff00) >> 8;
        this.setState({ modifiers: modCode });
        this.setState({ value: keymap });
      }
    } else {
      this.setState({ modifiers: 0 });
    }
    this.setState({ hexCode });
  }

  private onChangeModifiers(modCode: number) {
    let code = this.buildKeycodeWithModifier(
      parseInt(this.state.hexCode, 16),
      modCode
    );
    this.setState({ hexCode: Number(code).toString(16), modifiers: modCode });
  }

  private onChangeHoldKey(holdKey: KeycodeOption | null) {
    this.setState({ holdKey });
  }

  private onChangeTapKey(tapKey: KeycodeOption | null) {
    this.setState({ tapKey });
  }

  private updateLabel(label: string) {
    this.setState({ label });
    console.log(label);
    this.emitKeyChange({ label });
  }

  private buildKeycodeWithModifier(code: number, modCode: number): number {
    const keycode = code & 0x00ff;
    if ((modCode & 0x0f) == 0) {
      // no modifier
      code = keycode;
    } else {
      code = (modCode << 8) | keycode;
    }
    return code;
  }

  private selectTab(event: React.ChangeEvent<{}>, selectedTabIndex: number) {
    this.setState({ selectedTabIndex });
  }

  render() {
    if (this.props.anchorRef?.current == null) {
      return <div></div>;
    }
    return (
      <Popover
        id={this.props.id}
        open={this.props.open}
        anchorEl={this.props.anchorRef.current}
        onEnter={this.onEnter.bind(this)}
        onClose={() => {
          console.log('Popover.onClose');
          this.props.onClose();
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        className="customkey-popover"
      >
        <div className="customkey-body">
          <AppBar position="static" color="transparent" elevation={0}>
            <Tabs
              value={this.state.selectedTabIndex}
              onChange={(e, v) => {
                this.selectTab(e, v);
              }}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="KEYS" {...a11yProps(0)} />
              <Tab label="HOLD/TAP" {...a11yProps(1)} />
              <Tab label="CUSTOM" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.selectedTabIndex} index={0}>
            <AutocompleteKeys
              label="Keycode"
              keycodeOptions={this.basicKeymaps}
              keycodeInfo={this.state.value}
              onChange={(opt) => {
                this.onChangeKeys(opt);
              }}
            />
            <div className="customkey-desc">{this.state.value?.desc || ''}</div>
            <Modifiers
              disabled={this.disabledModifiers}
              code={this.state.modifiers}
              onChange={(mod) => {
                this.onChangeModifiers(mod);
              }}
            />
          </TabPanel>
          <TabPanel value={this.state.selectedTabIndex} index={1}>
            <div className="customkey-description">
              {'Please select each key code when Hold / Tap'}
            </div>
            <DualFunctionsKey
              value={this.props.value}
              layerCount={this.props.layerCount}
              onChange={(info) => {
                console.log(info);
              }}
            />
          </TabPanel>
          <TabPanel value={this.state.selectedTabIndex} index={2}>
            <div className="customkey-description">
              You can set a key label and assign its keycode(hex) manually.
            </div>
            <TextField
              variant="outlined"
              label="Label"
              className="customkey-field customkey-label"
              size="small"
              onChange={(e) => {
                this.updateLabel(e.target.value);
              }}
              value={this.state.label}
            />

            <TextField
              variant="outlined"
              label="Code(hex)"
              className="customkey-field customkey-label customkey-code"
              size="small"
              onChange={(e) => {
                this.onChangeHexCode(e.target.value);
              }}
              value={this.state.hexCode.toUpperCase()}
            />
            <div className="customkey-bcode">
              {(
                '0000000000000000' +
                parseInt(this.state.hexCode || '0', 16).toString(2)
              )
                .slice(-16)
                .replace(/([0-1]{4}?)/g, '$1 ')}
            </div>
          </TabPanel>
        </div>
      </Popover>
    );
  }
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="customkey-tabpanel"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <React.Fragment>{children}</React.Fragment>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export type KeycodeOption = IKeymap & {
  desc?: string;
  option?: IMod[] | number; // Modifiers, layer
  direction?: IModDirection;
};
