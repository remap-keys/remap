/* eslint-disable no-undef */
import React from 'react';
import './CustomKey.scss';
import Popover from '@material-ui/core/Popover';
import { AppBar, Tab, Tabs, TextField } from '@material-ui/core';
import { Key } from '../keycodekey/KeycodeKey.container';
import Keys from './Keys';
import {
  KeycodeCompositionFactory,
  LayerTapComposition,
  ModTapComposition,
  MOD_LEFT,
  SwapHandsComposition,
} from '../../../services/hid/Composition';
import HoldTapKey from './HoldTapKey';
import { IKeymap } from '../../../services/hid/Hid';
import { KeycodeList } from '../../../services/hid/KeycodeList';

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
  value: IKeymap | null; // Keys

  // 2 FUNCS TAB
  holdKey: IKeymap | null;
  tapKey: IKeymap | null;

  // Custom TAB
  label: string;
  hexCode: string; // support to show 001.
};

export default class CustomKey extends React.Component<OwnProps, OwnState> {
  arrowRef: React.RefObject<unknown>;

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
    this.arrowRef = React.createRef();
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

  private fromHex(hex: number) {
    const layerCount = this.props.layerCount;
    const factory = new KeycodeCompositionFactory(hex);
    const setKeysState = (value: IKeymap) => {
      this.setState({
        value: value,
        holdKey: null,
        tapKey: null,
      });
    };
    const setHoldTapState = (hold: IKeymap, tap: IKeymap) => {
      this.setState({
        value: null,
        holdKey: hold,
        tapKey: tap,
      });
    };
    if (factory.isBasic()) {
      const comp = factory.createBasicComposition();
      const opt = comp.getKey();
      setKeysState(opt);
    } else if (factory.isMods()) {
      const comp = factory.createModsComposition();
      const opt: IKeymap = {
        ...comp.getKey(),
        modifiers: comp.getModifiers(),
        direction: comp.getModDirection(),
      };
      setKeysState(opt);
    } else if (factory.isFunction()) {
      const comp = factory.createFunctionComposition();
      const opt = KeycodeList.findFunctionKeymap(comp.getFunctionId());
      opt.code = comp.getCode();
      opt.keycodeInfo!.code = comp.getCode();
      setKeysState(opt);
    } else if (factory.isTo()) {
      const comp = factory.createToComposition();
      const code = comp.getCode();
      const layer = comp.getLayer();
      const opt = KeycodeList.findToKeymap(layer, layerCount);
      opt.code = code;
      opt.option = layer;
      setKeysState(opt);
    } else if (factory.isMomentary()) {
      const comp = factory.createMomentaryComposition();
      const code = comp.getCode();
      const layer = comp.getLayer();
      const opt = KeycodeList.findMomentaryLayerKeymap(layer, layerCount);
      opt.code = code;
      opt.option = layer;
      setKeysState(opt);
    } else if (factory.isDefLayer()) {
      const comp = factory.createDefLayerComposition();
      const code = comp.getCode();
      const layer = comp.getLayer();
      const opt = KeycodeList.findDefLayerKeymap(layer, layerCount);
      opt.code = code;
      opt.option = layer;
      setKeysState(opt);
    } else if (factory.isLayerTapToggle()) {
      const comp = factory.createLayerTapToggleComposition();
      const code = comp.getCode();
      const layer = comp.getLayer();
      const opt = KeycodeList.findLayerTapToggleKeymap(layer, layerCount);
      opt.code = code;
      opt.option = layer;
      setKeysState(opt);
    } else if (factory.isToggleLayer()) {
      const comp = factory.createToggleLayerComposition();
      const code = comp.getCode();
      const layer = comp.getLayer();
      const opt = KeycodeList.findToggleLayerKeymap(layer, layerCount);
      opt.code = code;
      opt.option = layer;
      setKeysState(opt);
    } else if (factory.isLayerMod()) {
      const comp = factory.createLayerModComposition();
      const layer = comp.getLayer();
      const mods = comp.getModifiers();
      const direction = MOD_LEFT;
      const opt = KeycodeList.findLayerModKeymap(layer, layerCount);
      opt.modifiers = mods;
      opt.direction = direction;
      setKeysState(opt);
    } else if (factory.isOneShotLayer()) {
      const comp = factory.createOneShotLayerComposition();
      const code = comp.getCode();
      const layer = comp.getLayer();
      const opt = KeycodeList.findOneShotLayerKeymap(layer, layerCount);
      opt.code = code;
      opt.option = layer;
      setKeysState(opt);
    } else if (factory.isOneShotMod()) {
      const comp = factory.createOneShotModComposition();
      const code = comp.getCode();
      const mods = comp.getModifiers();
      const direction = comp.getModDirection();
      const opt = KeycodeList.findOneShotModKeymap(mods, direction);
      opt.code = code;
      setKeysState(opt);
    } else if (factory.isLooseKeycode()) {
      const comp = factory.createLooseKeycodeComposition();
      const opt = comp.getKey();
      setKeysState(opt);
    } else if (factory.isSwapHands()) {
      const comp = factory.createSwapHandsComposition();
      if (comp.isSwapHandsOption()) {
        const op = comp.getSwapHandsOption();
        const opt = KeycodeList.findSwapHandsOptionKeymap(op!);
        setKeysState(opt);
      } else {
        const hold = KeycodeList.getSwapHandsKeyOptionKeymap();
        const tap = comp.getKey()!;
        setHoldTapState(hold, tap);
      }
    } else if (factory.isModTap()) {
      const comp = factory.createModTapComposition();
      const hold = KeycodeList.findModTapKeymap(
        comp.getModifiers(),
        comp.getModDirection()
      );
      const tap = comp.getKey();
      setHoldTapState(hold, tap);
    } else if (factory.isLayerTap()) {
      const comp = factory.createLayerTapComposition();
      const hold = KeycodeList.findHoldLayerKeymap(
        comp.getLayer(),
        this.props.layerCount
      );
      const tap = comp.getKey();
      setHoldTapState(hold, tap);
    } else {
      throw new Error(`NOT TO BE HERE. code:${hex}, layerCount: ${layerCount}`);
    }
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
    const category = holdKey.categories[0];
    if (category === 'Hold-Layer') {
      comp = new LayerTapComposition(holdKey.option!, tapKey);
    } else if (category === 'Mod-Tap') {
      comp = new ModTapComposition(
        holdKey.direction!,
        holdKey.modifiers!,
        tapKey
      );
    } else if (category === 'Swap-Hands') {
      comp = new SwapHandsComposition(tapKey);
    } else {
      throw new Error(
        `NOT TO BE HERE. holdKey.category:${category}, tapKey.category: ${tapKey.categories}`
      );
    }

    const label: string = comp.getKey()!.keycodeInfo!.label;
    const code = comp.getCode();
    const hexCode: string = Number(code).toString(16);
    this.setState({ label, hexCode });
    const value: IKeymap = {
      code: code,
      isAny: false,
      categories: holdKey.categories,
      modifiers: holdKey.modifiers,
      direction: holdKey.direction,
      option: holdKey.option,
      keycodeInfo: tapKey.keycodeInfo!,
    };
    this.emitKeyChange({ value });
  }

  private onChangeHexCode(value: string) {
    const hexCode = value
      .toUpperCase()
      .replace(/[^0-9,A-F]/g, '')
      .slice(0, 4);
    const code = parseInt(hexCode, 16);
    this.fromHex(code);
    this.setState({ hexCode });
  }

  private updateLabel(label: string) {
    this.setState({ label });
    this.emitKeyChange({ label });
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
            <Keys
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
            <HoldTapKey
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
