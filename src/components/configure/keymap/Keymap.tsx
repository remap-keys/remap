import React from 'react';
import './Keymap.scss';
import { Badge, Chip, withStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import Keydiff from '../keydiff/Keydiff.container';
import { KeymapActionsType, KeymapStateType } from './Keymap.container';
import { IKeymap } from '../../../services/hid/Hid';
import KeyModel from '../../../models/KeyModel';
import KeyboardModel from '../../../models/KeyboardModel';
import Keycap from '../keycap/Keycap';
import ConfigurationDialog from '../configuration/ConfigurationDialog';

type OwnProp = {};

type KeymapPropsType = OwnProp &
  Partial<KeymapStateType> &
  Partial<KeymapActionsType>;

type OwnKeymapStateType = {
  configurationDialog: boolean;
  keyboardModel: KeyboardModel;
};

export default class Keymap extends React.Component<
  KeymapPropsType,
  OwnKeymapStateType
> {
  constructor(props: KeymapPropsType | Readonly<KeymapPropsType>) {
    super(props);
    this.state = {
      configurationDialog: false,
      keyboardModel: new KeyboardModel(this.props.keyboardKeymap!),
    };
  }

  private openConfigurationDialog() {
    this.setState({ configurationDialog: true });
  }

  private closeConfigurationDialog() {
    this.setState({ configurationDialog: false });
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: KeymapPropsType) {
    if (this.props.keyboardKeymap != nextProps.keyboardKeymap) {
      const kbd = new KeyboardModel(nextProps.keyboardKeymap!);
      this.setState({ keyboardModel: kbd });
    }
    return true;
  }

  render() {
    const {
      vendorId,
      productId,
      productName,
    } = this.props.keyboard!.getInformation();

    return (
      <React.Fragment>
        {this.props.draggingKey && <div className="dragMask"></div>}
        <div className="keydiff-wrapper">
          <div className="spacer"></div>
          <Keydiff />
          <div className="spacer"></div>
        </div>
        <div className="keyboards-wrapper">
          <div className="spacer"></div>
          <Layer
            layerCount={this.props.layerCount!}
            selectedLayer={this.props.selectedLayer!}
            remaps={this.props.remaps!}
            onClickLayer={(layer) => {
              this.props.onClickLayerNumber!(layer);
            }}
            onClickSettingIcon={this.openConfigurationDialog}
          />
          <Keyboard
            keyboardModel={this.state.keyboardModel}
            keyboardLabels={this.props.keyboardLabels!}
            keymaps={this.props.keymaps!}
            selectedKeyboardOptions={this.props.selectedKeyboardOptions!}
            selectedLayer={this.props.selectedLayer!}
            remaps={this.props.remaps!}
            setKeyboardSize={this.props.setKeyboardSize!}
          />
          <div className="balancer"></div>
          <div className="spacer"></div>
        </div>
        <ConfigurationDialog
          open={this.state.configurationDialog}
          onClose={this.closeConfigurationDialog.bind(this)}
          vendorId={vendorId}
          productId={productId}
          productName={productName}
        />
      </React.Fragment>
    );
  }
}

type LayerProps = {
  layerCount: number;
  selectedLayer: number;
  remaps: { [pos: string]: IKeymap }[];
  // eslint-disable-next-line no-unused-vars
  onClickLayer: (layer: number) => void;
  onClickSettingIcon: () => void;
};

function Layer(props: LayerProps) {
  const StyledBadge = withStyles((_) => ({
    badge: {
      right: 11,
      top: 9,
      border: `2px solid white`,
    },
  }))(Badge);
  const layers = [...Array(props.layerCount)].map((_, i) => i);
  return (
    <div className="layer-wrapper">
      <div className="layers">
        <div className="layer">
          <span>LAYER</span>
          {layers!.map((layer) => {
            const invisible =
              props.remaps![layer] == undefined ||
              0 == Object.values(props.remaps![layer]).length;
            return (
              <StyledBadge
                key={layer}
                color="primary"
                variant="dot"
                invisible={invisible}
              >
                <Chip
                  key={layer}
                  variant="outlined"
                  size="medium"
                  label={layer}
                  color={props.selectedLayer == layer ? 'primary' : undefined}
                  clickable={props.selectedLayer != layer}
                  onClick={() => {
                    props.onClickLayer(layer);
                  }}
                  className={
                    props.selectedLayer != layer
                      ? 'unselected-layer'
                      : 'selected-layer'
                  }
                />
              </StyledBadge>
            );
          })}
          <SettingsIcon className="option" onClick={props.onClickSettingIcon} />
        </div>
      </div>
    </div>
  );
}

type KeycapData = {
  model: KeyModel;
  keymap: IKeymap;
  remap: IKeymap | null;
};

type KeyboardType = {
  keyboardModel: KeyboardModel;
  keyboardLabels: (string | string[])[];
  keymaps: { [pos: string]: IKeymap }[];
  selectedKeyboardOptions: (string | null)[];
  selectedLayer: number;
  remaps: { [pos: string]: IKeymap }[];
  // eslint-disable-next-line no-unused-vars
  setKeyboardSize: (width: number, height: number) => void;
};

function Keyboard(props: KeyboardType) {
  const BORDER_WIDTH = 4;
  const LAYOUT_PADDING = 16;
  let layoutOptions = undefined;
  const hasKeyboardOptions = 0 < props.selectedKeyboardOptions!.length;
  if (hasKeyboardOptions) {
    const selectedKeyboardOptions: (
      | string
      | null
    )[] = props.selectedKeyboardOptions!;

    layoutOptions = props.keyboardLabels.map(
      (choices: string | string[], index) => {
        if (typeof choices == 'string') {
          const selected: string | null = selectedKeyboardOptions[index];
          return selected
            ? { option: '' + index, optionChoice: '1' }
            : { option: '' + index, optionChoice: '0' };
        } else {
          const choice: string = selectedKeyboardOptions[index] as string;
          const choiceIndex = choices.indexOf(choice) - 1; // first item of choices is for choice's label
          return { option: '' + index, optionChoice: '' + choiceIndex };
        }
      }
    );
  }

  const { keymaps, width, height, left } = props.keyboardModel.getKeymap(
    layoutOptions
  );
  props.setKeyboardSize(width, height);

  // TODO: performance tuning
  const deviceKeymaps = props.keymaps![props.selectedLayer!];
  const remaps = props.remaps![props.selectedLayer!];
  const keycaps: KeycapData[] = [];
  keymaps.forEach((model) => {
    const pos = model.pos;
    if (model.pos in deviceKeymaps) {
      const keymap: IKeymap = deviceKeymaps[pos];
      const remap: IKeymap | null = pos in remaps ? remaps[pos] : null;
      keycaps.push({ model, keymap, remap });
    } else {
      console.log(`No keymap on device: ${model.location}`);
    }
  });
  return (
    <div className="keyboards">
      <div
        className="keyboard-root"
        style={{
          width: width + (BORDER_WIDTH + LAYOUT_PADDING) * 2,
          height: height + (BORDER_WIDTH + LAYOUT_PADDING) * 2,
        }}
      >
        <div
          className="keyboard-frame"
          style={{ width: width, height: height, marginLeft: -left }}
        >
          {keycaps.map((keycap: KeycapData) => {
            return keycap.model.isDecal ? (
              ''
            ) : (
              <Keycap key={keycap.model.location} {...keycap} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
