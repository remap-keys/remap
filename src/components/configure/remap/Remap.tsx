import React from 'react';
import './Remap.scss';
import KEY_DESCRIPTIONS from '../../../assets/files/key_descriptions';
import { IKeymap } from '../../../services/hid/Hid';
import { hexadecimal } from '../../../utils/StringUtils';
import Keycodes from '../keycodes/Keycodes.container';
import Keymap from '../keymap/Keymap.container';
import { RemapActionsType, RemapStateType } from './Remap.container';

type OwnProp = {};
type RemapPropType = OwnProp &
  Partial<RemapStateType> &
  Partial<RemapActionsType>;

export default class Remap extends React.Component<RemapPropType, {}> {
  constructor(props: RemapPropType | Readonly<RemapPropType>) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="keyboard-wrapper">
          <div className="keymap">
            <Keymap />
          </div>
        </div>
        <div
          className="keycode"
          style={{ marginTop: 200 + this.props.keyboardHeight! }}
        >
          <Keycodes />
        </div>
        {this.props.hoverKey && <Desc keymap={this.props.hoverKey.keymap} />}
      </React.Fragment>
    );
  }
}

type DescType = {
  keymap: IKeymap;
};
function Desc(props: DescType) {
  if (props.keymap.keycodeInfo) {
    const info = props.keymap.keycodeInfo!;
    const long = info.name.long;
    const desc =
      long in KEY_DESCRIPTIONS
        ? KEY_DESCRIPTIONS[long]
        : hexadecimal(info.code);
    return (
      <div className="keycode-desc">
        {long}: {desc}
      </div>
    );
  } else {
    return <div className="keycode-desc">Any</div>;
  }
}
