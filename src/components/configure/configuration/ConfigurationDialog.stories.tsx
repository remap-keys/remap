import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ConfigurationDialog from './ConfigurationDialog';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { hexadecimal } from '../../../utils/StringUtils';

export default {
  title: 'ConfigurationDialog',
  component: ConfigurationDialog,
  decorators: [
    (Story: any) => (
      <React.Fragment>
        <CssBaseline />
        <Story />
      </React.Fragment>
    ),
  ],
};

// eslint-disable-next-line no-unused-vars
const keyboardDefinition: KeyboardDefinitionSchema = {
  name: 'Dummy',
  vendorId: hexadecimal(777),
  productId: hexadecimal(1),
  lighting: {
    extends: 'qmk_backlight_rgblight',
    underglowEffects: [
      ['ON/OFF', 0],
      ['Solid Color', 1],
      ['Solid - Highlighted Mods', 1],
      ['Vertical Gradient', 1],
      ['Horizontal Gradient', 1],
      ['Breathing', 1],
      ['Colorband - Saturation', 1],
      ['Colorband - Brightness', 1],
      ['Pinwheel - Saturation', 1],
      ['Pinwheel - Brightness', 1],
      ['Spiral - Saturation', 1],
      ['Spiral - Brightness', 1],
      ['Cycle All', 0],
      ['Cycle Horizontal', 1],
      ['Cycle Vertical', 1],
      ['Rainbow Chevron', 1],
      ['Cycle - In/Out', 1],
      ['Cycle - In/Out Dual', 1],
      ['Cycle - Pinwheel', 1],
      ['Cycle - Spiral', 1],
      ['Dual Beacon', 1],
      ['Rainbow Beacon', 1],
      ['Rainbow Pinwheels', 1],
      ['Raindrops', 1],
      ['Jellybean Raindrops', 1],
    ],
  },
  matrix: {
    rows: 1,
    cols: 1,
  },
  layouts: {
    keymap: [],
  },
};

export const Default = () => (
  <ConfigurationDialog
    open={true}
    onClose={() => {}}
    vendorId={0x5954}
    productId={0x0001}
    productName="Product Name"
    refreshKeyboardDefinition={() => {}}
  />
);

export const NoOptions = () => (
  <ConfigurationDialog
    open={true}
    onClose={() => {}}
    vendorId={0x5954}
    productId={0x0001}
    productName="Product Name"
    refreshKeyboardDefinition={(kd: KeyboardDefinitionSchema) => {
      console.log(kd);
    }}
  />
);

class ConfigurationDialogAdapter extends React.Component<any, {}> {
  private dialog: ConfigurationDialog;
  constructor(props: any) {
    super(props);
    this.dialog = new ConfigurationDialog(props);
    this.dialog.state = {
      selectedMenuIndex: 1,
      keyboardDefinition: {} as KeyboardDefinitionSchema,
      keyboardDefinitionFile: 'keyboard_def.json',
    };
  }
  render() {
    return this.dialog.render();
  }
}

export const ValidKeyboardDefinition = () => (
  <ConfigurationDialogAdapter
    open={true}
    onClose={() => {}}
    vendorId={0x5954}
    productId={0x0001}
    productName="Product Name"
    refreshKeyboardDefinition={(kd: KeyboardDefinitionSchema) => {
      console.log(kd);
    }}
  />
);
