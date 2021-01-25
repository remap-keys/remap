import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import LayoutOptionsDialog from './LayoutOptionsDialog';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';

export default {
  title: 'LayoutOptionsDialog',
  component: LayoutOptionsDialog,
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
  <LayoutOptionsDialog
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
  <LayoutOptionsDialog
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

class LayoutOptionsDialogAdapter extends React.Component<any, {}> {
  private dialog: LayoutOptionsDialog;
  constructor(props: any) {
    super(props);
    this.dialog = new LayoutOptionsDialog(props);
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
  <LayoutOptionsDialogAdapter
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
