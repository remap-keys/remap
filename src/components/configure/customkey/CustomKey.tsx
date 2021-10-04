/* eslint-disable no-undef */
import React from 'react';
import './CustomKey.scss';
import Popover from '@material-ui/core/Popover';
import { AppBar, Tab, Tabs, TextField } from '@material-ui/core';
import { Key } from '../keycodekey/KeyGen';
import TabKey from './TabKey.container';
import {
  DIRECTION_LABELS,
  LayerTapComposition,
  ModsComposition,
  ModTapComposition,
  MOD_LABELS,
  MOD_LEFT,
  SwapHandsComposition,
} from '../../../services/hid/Composition';
import TabHoldTapKey, { buildHoldKeyLabel } from './TabHoldTapKey';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import { buildModLabel, mods2Number } from './Modifiers';
import {
  KeyboardLabelLang,
  KeyLabelLangs,
} from '../../../services/labellang/KeyLabelLangs';
import { getMetaLabel } from '../../../services/labellang/KeyLabel';

export const CUSTOMKEY_POPOVER_WIDTH = 400;
export const CUSTOMKEY_POPOVER_HEIGHT = 240;
export const CUSTOMKEY_POPOVER_TRIANGLE = 15;
export type PopoverPosition = {
  left: number;
  top: number;
  side: 'left' | 'above' | 'below' | 'right';
};

const TAB_INDEX_KEY = 0;
const TAB_INDEX_HOLDTAP = 1;
const TAB_INDEX_CUSTOM = 2;

type OwnProps = {
  id: string;
  value: Key;
  layerCount: number;
  open: boolean;
  position: PopoverPosition;
  labelLang: KeyboardLabelLang;
  bleMicroPro: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (newKey: Key) => void;
};

type OwnState = {
  selectedTabIndex: number;

  // Keys TAB
  value: IKeymap | null;

  // 2 FUNCS TAB
  holdKey: IKeymap | null;
  tapKey: IKeymap | null;

  // Custom TAB
  label: string;
  hexCode: string; // MUST be hexadecimal but not number to support to show 001.
  modsLabel: string;
  holdLabel: string;
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
      modsLabel: '',
      holdLabel: '',
    };
  }

  private onEnter() {
    //TODO: initialize input status
    const keymap: IKeymap = this.props.value.keymap;
    const code = keymap.code;
    const hexCode = Number(code).toString(16);
    const label = keymap.keycodeInfo ? keymap.keycodeInfo.label : 'Any';
    let selectedTabIndex = 0;
    let value = null;
    let holdKey = null;
    let tapKey = null;
    if (TabKey.isAvailable(code)) {
      value = keymap;
      selectedTabIndex = 0;
    } else if (TabHoldTapKey.isAvailable(code)) {
      const keys = TabHoldTapKey.genHoldTapKeys(code, this.props.labelLang);
      holdKey = keys.holdKey;
      tapKey = keys.tapKey;
      selectedTabIndex = 1;
    } else {
      selectedTabIndex = 2;
    }
    this.setState({
      value,
      holdKey,
      tapKey,
      label,
      hexCode,
    });
    this.updateCustomMetaLabels({ value, holdKey });
    setTimeout(() => {
      this.setState({ selectedTabIndex }); // for collecting css animation
    }, 180);
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
      code,
      keycodeInfo: { ...value.keycodeInfo!, ...{ label: label, code: code } },
    };

    if (keymap.modifiers.length === 0) {
      // direction is fixed to LEFT if no modifiers.
      keymap.direction = MOD_LEFT;
    }

    const key: Key = {
      label: label,
      meta: '',
      keymap: keymap,
    };
    this.props.onChange(key);
  }

  private isMeaningfulChange(km: IKeymap): boolean {
    const dstMods = ModsComposition.genBinary(km.modifiers);

    if (km.kinds.includes('osm') && dstMods === 0) {
      // OneShotMods without any modifiers
      return false;
    }

    return true;
  }

  private onChangeKey(value: IKeymap | null) {
    if (value == null) {
      this.setState({ value: value, label: '', hexCode: '' });
      return;
    }

    const hexCode = value.code ? Number(value.code).toString(16) : '';
    const label = value.keycodeInfo!.label;
    this.setState({ value, label, hexCode });

    this.updateCustomMetaLabels({ value });

    if (this.isMeaningfulChange(value)) {
      this.emitKeyChange({ value, label });
    }
  }

  private onChangeHoldTap(holdKey: IKeymap | null, tapKey: IKeymap | null) {
    this.setState({ holdKey, tapKey });
    this.updateCustomMetaLabels({ holdKey });
    if (holdKey === null || tapKey === null) {
      this.setState({ label: '', hexCode: '' });
      return;
    }
    let comp: ModTapComposition | LayerTapComposition | SwapHandsComposition;

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

    const label: string = comp.genTapKey()!.keycodeInfo!.label;
    const code = comp.getCode();
    const hexCode: string = Number(code).toString(16);
    this.setState({ label, hexCode });
    const value: IKeymap = genHoldTapKeymap(code, holdKey, tapKey);
    this.emitKeyChange({ value });
  }

  private onChangeHexCode(value: string) {
    const hexCode: string = value
      .toUpperCase()
      .replace(/[^0-9,A-F]/g, '')
      .slice(0, 4);
    this.setState({ hexCode });
    const code = parseInt(hexCode, 16);
    if (Number.isNaN(code)) {
      const km = KeycodeList.getKeymap(0, this.props.labelLang);
      this.setState({ value: km });
    } else {
      const ret = KeycodeList.getKeymaps(code, this.props.labelLang);
      if (ret.value) {
        this.onChangeKey(ret.value);
      } else if (ret.holdKey && ret.tapKey) {
        this.onChangeHoldTap(ret.holdKey, ret.tapKey);
      }
    }
  }

  private onChangeLabel(label: string) {
    this.setState({ label });
    this.emitKeyChange({ label });
  }

  private updateCustomMetaLabels(args: {
    value?: IKeymap | null;
    holdKey?: IKeymap | null;
  }) {
    const km: IKeymap | null | undefined = args.value
      ? args.value
      : args.holdKey;
    if (km) {
      const holdLabel = buildHoldKeyLabel(km);
      const modsLabel =
        holdLabel === ''
          ? buildModLabel(km.modifiers || null, km.direction!)
          : '';
      this.setState({ modsLabel, holdLabel });
    } else {
      this.setState({ modsLabel: '', holdLabel: '' });
    }
  }

  private selectTab(event: React.ChangeEvent<{}>, selectedTabIndex: number) {
    this.setState({ selectedTabIndex });
    if (selectedTabIndex === 0 && this.state.value) {
      this.onChangeKey(this.state.value);
    } else if (
      selectedTabIndex === 1 &&
      this.state.holdKey &&
      this.state.tapKey
    ) {
      this.onChangeHoldTap(this.state.holdKey, this.state.tapKey);
    }
  }

  render() {
    let desc = this.state.value?.desc || '';
    if (this.state.value && this.state.value.modifiers.length) {
      const mods = mods2Number(
        this.state.value.modifiers,
        this.state.value.direction
      );
      const keyLabel = KeyLabelLangs.findKeyLabel(
        this.state.value.keycodeInfo.code,
        mods,
        this.props.labelLang
      );

      if (keyLabel) {
        const labelLangLabel = KeyLabelLangs.getLabelLangMenuLabel(
          this.props.labelLang
        );
        const directionLabel = DIRECTION_LABELS[this.state.value.direction];
        const modLabels = this.state.value.modifiers
          .map((m) => MOD_LABELS[m])
          .join('+');
        const metaLabel = getMetaLabel(keyLabel, mods);

        desc = `(${labelLangLabel}) ${directionLabel} ${modLabels} + ${keyLabel.label} → ${metaLabel}`;
      }
    }

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
          <TabPanel value={this.state.selectedTabIndex} index={TAB_INDEX_KEY}>
            <TabKey
              value={this.state.value}
              desc={desc}
              layerCount={this.props.layerCount}
              hexCode={this.state.hexCode}
              labelLang={this.props.labelLang}
              bleMicroPro={this.props.bleMicroPro}
              autoFocus={this.state.selectedTabIndex === TAB_INDEX_KEY}
              onChangeKey={(opt: IKeymap) => {
                this.onChangeKey(opt);
              }}
            />
          </TabPanel>
          <TabPanel
            value={this.state.selectedTabIndex}
            index={TAB_INDEX_HOLDTAP}
          >
            <div className="customkey-description">
              {'Please select each key code when Hold / Tap'}
            </div>
            <TabHoldTapKey
              holdKey={this.state.holdKey}
              tapKey={this.state.tapKey}
              layerCount={this.props.layerCount}
              labelLang={this.props.labelLang}
              autoFocus={this.state.selectedTabIndex === TAB_INDEX_HOLDTAP}
              onChange={(hold, tap) => {
                this.onChangeHoldTap(hold, tap);
              }}
            />
          </TabPanel>
          <TabPanel
            value={this.state.selectedTabIndex}
            index={TAB_INDEX_CUSTOM}
          >
            <div className="customkey-description">
              You can assign a keycode(hex) manually.
            </div>
            <TextField
              variant="outlined"
              label="Label"
              className="customkey-label"
              size="small"
              disabled={true}
              onChange={(e) => {
                this.onChangeLabel(e.target.value);
              }}
              value={this.state.label}
            />
            <div className="customkey-meta">
              <div>{this.state.modsLabel}</div>
              <div>{this.state.holdLabel}</div>
            </div>
            <div className="customkey-desc">{desc}</div>

            <TextField
              variant="outlined"
              label="Code(hex)"
              className={[
                'customkey-field',
                'customkey-field-hex',
                'customkey-label',
                0 < this.state.hexCode.length && 'customkey-code',
              ].join(' ')}
              size="small"
              onChange={(e) => {
                this.onChangeHexCode(e.target.value);
              }}
              onFocus={(evt) => evt.target.select()}
              value={this.state.hexCode.toUpperCase()}
              autoFocus={this.state.selectedTabIndex === TAB_INDEX_CUSTOM}
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
