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
};

export default class Remap extends React.Component<RemapPropType, OwnState> {
  private keyboardWrapperRef: React.RefObject<HTMLDivElement>;
  constructor(props: RemapPropType | Readonly<RemapPropType>) {
    super(props);
    this.state = {
      keycodeY: 0,
    };
    this.keyboardWrapperRef = React.createRef<HTMLDivElement>();
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: RemapPropType, nextState: OwnState) {
    if (!this.keyboardWrapperRef.current) return true;

    const headerHeight = 56;
    const rect = this.keyboardWrapperRef.current.getBoundingClientRect();
    const keycodeY = headerHeight + rect.height;
    if (this.state.keycodeY != keycodeY) {
      this.setState({ keycodeY });
    }

    return true;
  }

  render() {
    return (
      <React.Fragment>
        <div className="keyboard-wrapper" ref={this.keyboardWrapperRef}>
          <div className="keymap">
            <Keymap />
          </div>
        </div>
        <div className="keycode" style={{ marginTop: this.state.keycodeY }}>
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
