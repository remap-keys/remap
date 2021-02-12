/* eslint-disable no-undef */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import CustomKey from './CustomKey';
import Keycap from '../keycap/Keycap';
import KeyModel from '../../../models/KeyModel';
import { Key } from '../keycodekey/KeycodeKey.container';
import { MOD_LEFT } from '../../../services/hid/Composition';

export default {
  title: 'CustomKey',
  component: CustomKey,
  decorators: [
    (Story: any) => (
      <React.Fragment>
        <CssBaseline />
        <div style={{ position: 'absolute', top: 400, left: 300 }}>
          <Story />
        </div>
      </React.Fragment>
    ),
  ],
};

type State = {
  open: boolean;
  key: Key;
};
class CustomKeyStory extends React.Component<{}, State> {
  private anchorRef: React.MutableRefObject<null>;
  private model: KeyModel;

  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      key: {
        label: '▽',
        meta: '',
        keymap: {
          isAny: false,
          code: 1,
          direction: MOD_LEFT,
          modifiers: [],
          kinds: ['basic'],
          keycodeInfo: {
            code: 1,
            name: {
              long: 'KC_TRANSPARENT',
              short: 'KC_TRNS',
            },
            label: '▽',
          },
        },
      },
    };
    this.anchorRef = React.createRef();
    this.model = new KeyModel(null, '0,0', 0, 0, '#cccccc');
  }

  private openPopover(key: Key) {
    this.setState({ open: true, key: key });
  }

  private onClose() {
    this.setState({ open: false });
  }

  private setKey(key: Key) {
    this.setState({ key });
  }

  render() {
    return (
      <React.Fragment>
        <Keycap
          anchorRef={this.anchorRef}
          model={this.model}
          keymap={this.state.key.keymap}
          remap={null}
          onClick={(pos: string, key: Key) => {
            this.openPopover(key);
          }}
          onClickKeycap={() => {}}
        />
        <CustomKey
          id="customkey-popover"
          value={this.state.key}
          open={this.state.open}
          layerCount={4}
          position={{ left: 200, top: 200, side: 'above' }}
          onClose={this.onClose.bind(this)}
          onChange={(key: Key) => {
            this.setKey(key);
          }}
        />
      </React.Fragment>
    );
  }
}

export const Test = () => {
  return <CustomKeyStory />;
};
