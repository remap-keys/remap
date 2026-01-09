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
  private readonly keyboardWrapperRef: React.RefObject<HTMLDivElement>;
  private readonly keycodeRef: React.RefObject<HTMLDivElement>;

  constructor(props: RemapPropType | Readonly<RemapPropType>) {
    super(props);
    this.keyboardWrapperRef = React.createRef();
    this.keycodeRef = React.createRef();
    this.state = {
      minWidth: 0,
    };
  }

  private handleWindowResize() {
    // To fetch the correct height of the keyboard wrapper,
    // we need to wait until the keyboard wrapper is rendered.
    setTimeout(() => {
      if (!this.keyboardWrapperRef.current || !this.keycodeRef.current) {
        return;
      }
      // Calculate the height of the keyboard wrapper,
      // and set the height of the keycode wrapper
      // to the height of the window minus the height of
      // the keyboard wrapper dynamically.
      const keyboardWrapperHeight =
        this.keyboardWrapperRef.current.clientHeight;
      const headerHeight = 56;
      const footerHeight = 27;
      const windowHeight = window.innerHeight;
      const keycodeWrapperHeight =
        windowHeight - keyboardWrapperHeight - headerHeight - footerHeight;
      this.keycodeRef.current.style.height = `${keycodeWrapperHeight}px`;
    }, 0);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize.bind(this));
  }

  componentDidUpdate(prevProps: RemapPropType) {
    if (this.props.keyboardWidth != prevProps.keyboardWidth) {
      this.setState({
        minWidth: this.props.keyboardWidth! + MIN_SIDE_MENU_WIDTH * 2,
      });
      // Call once to set the initial height.
      this.handleWindowResize();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="keyboard-wrapper"
          style={{ minWidth: this.state.minWidth }}
          ref={this.keyboardWrapperRef}
        >
          <EditMode mode={this.props.macroKey ? 'macro' : 'keymap'} />
        </div>
        {this.props.typingPractice! ? (
          <div>Typing Practice</div>
        ) : (
          <>
            <div
              className="keycode"
              style={{ minWidth: this.state.minWidth }}
              ref={this.keycodeRef}
            >
              <Keycodes />
            </div>
            <Desc value={this.props.hoverKey} />
          </>
        )}
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
