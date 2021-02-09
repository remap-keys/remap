/* eslint-disable no-undef */
import React from 'react';
import './CustomKey.scss';
import Popover from '@material-ui/core/Popover';
import { AppBar, Tab, Tabs, TextField } from '@material-ui/core';
import { Key } from '../keycodekey/KeycodeKey.container';
import TabKey from './TabKey';
import {
  KeycodeCompositionFactory,
  LayerTapComposition,
  ModTapComposition,
  SwapHandsComposition,
} from '../../../services/hid/Composition';
import TabHoldTapKey from './TabHoldTapKey';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';

export const CUSTOMKEY_POPOVER_WIDTH = 400;
export const CUSTOMKEY_POPOVER_HEIGHT = 240;
export const CUSTOMKEY_POPOVER_TRIANGLE = 15;
export type PopoverPosition = {
  left: number;
  top: number;
  side: 'left' | 'above' | 'below' | 'right';
};

type OwnProps = {
  id: string;
  value: Key;
  layerCount: number;
  open: boolean;
  position: PopoverPosition;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (newKey: Key) => void;
};

type OwnState = {
  selectedTabIndex: number;

  // Keys TAB
  value: IKeymap | null; // Keys

  // 2 FUNCS TAB
  holdKey: IKeymap | null;
  tapKey: IKeymap | null;

  // Custom TAB
  label: string;
  hexCode: string; // support to show 001.
};

export default class CustomKey extends React.Component<OwnProps, OwnState> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      value: null,
      holdKey: null,
      tapKey: null,
      selectedTabIndex: 0,
      label: '',
      hexCode: '',
    };
  }

  get disabledModifiers() {
    const factory = new KeycodeCompositionFactory(
      parseInt(this.state.hexCode, 16)
    );
    return !(factory.isBasic() || factory.isMods());
  }

  private onEnter() {
    //TODO: initialize input status
    const keymap: IKeymap = this.props.value.keymap;
    this.setState({
      value: this.props.value.keymap,
      label: this.props.value.keymap.keycodeInfo!.label,
      hexCode: Number(keymap.code).toString(16),
    });
  }

  private emitKeyChange(args: {
    value?: IKeymap;
    label?: string;
    code?: number;
  }) {
    let label = args.label == undefined ? this.state.label : args.label;
    let code =
      args.code == undefined ? parseInt(this.state.hexCode, 16) : args.code;
    let value = this.state.value!;
    if (args.value) {
      label = args.label ? args.label : args.value.keycodeInfo!.label;
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

    this.props.onChange(key);
  }

  private onChangeKeys(value: IKeymap | null) {
    if (value == null) {
      this.setState({ value: value, label: '', hexCode: '' });
      return;
    }

    const label = value.keycodeInfo!.label;
    this.setState({
      value: value,
      label: label,
      hexCode: Number(value.code).toString(16),
    });

    this.emitKeyChange({ value, label });
  }

  private onChangeHoldTap(holdKey: IKeymap | null, tapKey: IKeymap | null) {
    this.setState({ holdKey, tapKey });
    if (holdKey === null || tapKey === null) {
      this.setState({ label: '', hexCode: '' });
      return;
    }
    let comp:
      | ModTapComposition
      | LayerTapComposition
      | SwapHandsComposition
      | null = null;
    const kinds = holdKey.kinds;
    if (kinds.includes('layer_tap')) {
      comp = new LayerTapComposition(holdKey.option!, tapKey);
    } else if (kinds.includes('mod_tap')) {
      comp = new ModTapComposition(
        holdKey.direction!,
        holdKey.modifiers!,
        tapKey
      );
    } else if (kinds.includes('swap_hands')) {
      comp = new SwapHandsComposition(tapKey);
    } else {
      throw new Error(
        `NOT TO BE HERE. holdKey.kind:${kinds}, tapKey.kind: ${tapKey.kinds}`
      );
    }

    const label: string = comp.genTapKey().keycodeInfo!.label;
    const code = comp.getCode();
    const hexCode: string = Number(code).toString(16);
    this.setState({ label, hexCode });
    const value: IKeymap = genHoldTapKeymap(code, holdKey, tapKey);
    this.emitKeyChange({ value });
  }

  private onChangeHexCode(value: string) {
    const hexCode = value
      .toUpperCase()
      .replace(/[^0-9,A-F]/g, '')
      .slice(0, 4);
    const code = parseInt(hexCode, 16);
    const ret = KeycodeList.getKeymaps(code);
    this.setState({
      ...ret,
      hexCode,
      label: ret.value
        ? ret.value.keycodeInfo!.label
        : ret.tapKey!.keycodeInfo!.label,
    });

    if (ret.value) {
      this.emitKeyChange({ value: ret.value });
    } else if (ret.holdKey && ret.tapKey) {
      const value = genHoldTapKeymap(code, ret.holdKey, ret.tapKey);
      this.emitKeyChange({ value });
    }
  }

  private updateLabel(label: string) {
    this.setState({ label });
    this.emitKeyChange({ label });
  }

  private selectTab(event: React.ChangeEvent<{}>, selectedTabIndex: number) {
    this.setState({ selectedTabIndex });
  }

  render() {
    return (
      <Popover
        id={this.props.id}
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.props.position}
        onEnter={this.onEnter.bind(this)}
        onClose={() => {
          this.props.onClose();
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className={`customkey-popover popover-${this.props.position.side}`}
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
              <Tab label="KEY" {...a11yProps(0)} />
              <Tab label="HOLD/TAP" {...a11yProps(1)} />
              <Tab label="CUSTOM" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.selectedTabIndex} index={0}>
            <TabKey
              value={this.state.value}
              layerCount={this.props.layerCount}
              hexCode={this.state.hexCode}
              onChangeKey={(opt: IKeymap) => {
                this.onChangeKeys(opt);
              }}
            />
          </TabPanel>
          <TabPanel value={this.state.selectedTabIndex} index={1}>
            <div className="customkey-description">
              {'Please select each key code when Hold / Tap'}
            </div>
            <TabHoldTapKey
              holdKey={this.state.holdKey}
              tapKey={this.state.tapKey}
              layerCount={this.props.layerCount}
              onChange={(hold, tap) => {
                this.onChangeHoldTap(hold, tap);
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
              disabled={true}
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

function genHoldTapKeymap(
  code: number,
  holdKey: IKeymap,
  tapKey: IKeymap
): IKeymap {
  const keymap = {
    code: code,
    isAny: false,
    kinds: holdKey.kinds,
    modifiers: holdKey.modifiers,
    direction: holdKey.direction,
    option: holdKey.option,
    keycodeInfo: tapKey.keycodeInfo!,
  };
  return keymap;
}
