import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ConfigurationDialog from './ConfigurationDialog';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';

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

export const Default = () => (
  <ConfigurationDialog
    open={true}
    onClose={() => {}}
    vendorId={0x5954}
    productId={0x0001}
    productName="Product Name"
    keyboardLayoutOptions={[
      'Option1',
      ['Option2', 'Option2-1', 'Option2-2'],
      'Option3',
      ['Option4', 'Option4-1', 'Option4-2', 'Option4-3'],
    ]}
    selectedKeyboardOptions={[null, 'Option2-2', 'Option3', 'Option4-1']}
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
    keyboardLayoutOptions={[]}
    selectedKeyboardOptions={[]}
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
      selectedMenuIndex: 0,
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
    keyboardLayoutOptions={[]}
    selectedKeyboardOptions={[]}
    refreshKeyboardDefinition={(kd: KeyboardDefinitionSchema) => {
      console.log(kd);
    }}
  />
);
