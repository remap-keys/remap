import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import LayoutOptionsDialog from './LayoutOptionsDialog';

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
    vendorId={0}
    productId={0}
    keyboardLayoutOptions={[
      'Option1',
      ['Option2', 'Option2-1', 'Option2-2'],
      'Option3',
      ['Option4', 'Option4-1', 'Option4-2', 'Option4-3'],
    ]}
    selectedKeyboardOptions={[null, 'Option2-2', 'Option3', 'Option4-1']}
  />
);
