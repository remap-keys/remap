/* eslint-disable no-undef */
import React from 'react';
import './Remap.scss';
import { hexadecimal } from '../../../utils/StringUtils';
import Keycodes from '../keycodes/Keycodes.container';
import Keymap from '../keymap/Keymap.container';
import { RemapActionsType, RemapStateType } from './Remap.container';
import { Key } from '../keycodekey/KeyGen';
import { kinds2CategoryLabel } from '../customkey/AutocompleteKeys';
import MacroEditor from '../macroeditor/MacroEditor.container';

type OwnProp = {};
type RemapPropType = OwnProp &
  Partial<RemapStateType> &
  Partial<RemapActionsType>;

type OwnState = {
  minWidth: number;
};

const MIN_SIDE_MENU_WIDTH = 80;

export default class Remap extends React.Component<RemapPropType, OwnState> {
  constructor(props: RemapPropType | Readonly<RemapPropType>) {
    super(props);
    this.state = {
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
          <EditMode mode={this.props.macroKey ? 'macro' : 'keymap'} />
        </div>
        <div className="keycode" style={{ minWidth: this.state.minWidth }}>
          <Keycodes />
        </div>
        <Desc value={this.props.hoverKey} />
      </React.Fragment>
    );
  }
}

type EditModeType = {
  mode: 'keymap' | 'macro';
};
function EditMode(props: EditModeType) {
  if (props.mode === 'keymap') {
    return (
      <div className="keymap">
        <Keymap />
      </div>
    );
  } else if (props.mode === 'macro') {
    return (
      <div className="macro">
        <MacroEditor />
      </div>
    );
  } else {
    return <div></div>;
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
    const isAscii = props.value.keymap.isAscii;
    const code = info.code;
    const hex = hexadecimal(code);
    const categories = kinds2CategoryLabel(props.value.keymap.kinds);
    const desc = props.value.keymap.desc ? ': ' + props.value.keymap.desc : '';
    const keycodeName = props.value.keymap.keycodeInfo.name.long;
    const label = isAscii ? `ASCII(${keycodeName})` : keycodeName;
    return (
      <div className="keycode-desc">
        <div className="keycode-desc-label">
          {`/${categories}/${props.value.label}${desc}`}
        </div>
        <div className="keycode-desc-detail">{`${label} | ${hex}(${code})`}</div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
