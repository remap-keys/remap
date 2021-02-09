import React from 'react';
import './Remap.scss';
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
          style={{ marginTop: 206 + this.props.keyboardHeight! }}
        >
          <Keycodes />
        </div>
        <Desc keymap={this.props.hoverKey?.keymap} />
      </React.Fragment>
    );
  }
}

type DescType = {
  keymap?: IKeymap;
};
function Desc(props: DescType) {
  if (!props.keymap) return <div></div>;
  if (props.keymap.isAny) return <div className="keycode-desc">Any</div>;
  if (props.keymap.keycodeInfo && props.keymap.desc) {
    const info = props.keymap.keycodeInfo!;
    const hex = hexadecimal(info.code);
    return (
      <div className="keycode-desc">
        {props.keymap.keycodeInfo.label}({hex}): {props.keymap.desc}
      </div>
    );
  } else {
    return <div></div>;
  }
}
