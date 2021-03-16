/* eslint-disable no-undef */
import React from 'react';
import './Remap.scss';
import { hexadecimal } from '../../../utils/StringUtils';
import Keycodes from '../keycodes/Keycodes.container';
import Keymap from '../keymap/Keymap.container';
import { RemapActionsType, RemapStateType } from './Remap.container';
import { Key } from '../keycodekey/KeyGen';
import { kinds2CategoriyLabel } from '../customkey/AutocompleteKeys';

type OwnProp = {};
type RemapPropType = OwnProp &
  Partial<RemapStateType> &
  Partial<RemapActionsType>;

type OwnState = {
  keycodeY: number;
  minWidth: number;
};

const MIN_SIDE_MENU_WIDTH = 80;

export default class Remap extends React.Component<RemapPropType, OwnState> {
  constructor(props: RemapPropType | Readonly<RemapPropType>) {
    super(props);
    this.state = {
      keycodeY: 0,
      minWidth: 0,
    };
  }

  componentDidUpdate(prevProps: RemapPropType) {
    if (this.props.keyboardWidth != prevProps.keyboardWidth) {
      this.setState({
        minWidth: this.props.keyboardWidth! + MIN_SIDE_MENU_WIDTH * 2,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="keyboard-wrapper"
          style={{ minWidth: this.state.minWidth }}
        >
          <div className="keymap">
            <Keymap />
          </div>
        </div>
        <div className="keycode" style={{ minWidth: this.state.minWidth }}>
          <Keycodes />
        </div>
        <Desc value={this.props.hoverKey} />
      </React.Fragment>
    );
  }
}

type DescType = {
  value: Key | null | undefined;
};
function Desc(props: DescType) {
  if (!props.value) return <div></div>;
  if (props.value.keymap.isAny) return <div className="keycode-desc">Any</div>;
  if (props.value.keymap.keycodeInfo) {
    const info = props.value.keymap.keycodeInfo!;
    const hex = hexadecimal(info.code);
    const categories = kinds2CategoriyLabel(props.value.keymap.kinds);
    const desc = props.value.keymap.desc ? ': ' + props.value.keymap.desc : '';
    const keycodeName = props.value.keymap.keycodeInfo.name.long;
    return (
      <div className="keycode-desc">
        <div className="keycode-desc-label">
          {`/${categories}/${props.value.label}${desc}`}
        </div>
        <div className="keycode-desc-detail">{`${keycodeName} | ${hex}(${info.code})`}</div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
