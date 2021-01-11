import React from 'react';
import AnyKeyDialog from './any/AnyKeyEditDialog';
import {
  Key,
  KeycodeKeyActionsType,
  KeycodeKeyStateType,
} from './KeycodeKey.container';
import './KeycodeKey.scss';

export type AnyKey = {
  label: string;
  code: number;
};

type KeycodeKeyOwnState = {
  dragging: boolean;
  openDialog: boolean;
  selectedKey: AnyKey | null;
};

export type KeycodeKeyOwnProps = {
  index?: number;
  value: Key;
  draggable: boolean;
};

export type KeycodeKeyProps = KeycodeKeyOwnProps &
  Partial<KeycodeKeyActionsType> &
  Partial<KeycodeKeyStateType>;

export default class KeycodeKey extends React.Component<
  KeycodeKeyProps,
  KeycodeKeyOwnState
> {
  constructor(props: KeycodeKeyProps | Readonly<KeycodeKeyProps>) {
    super(props);
    this.state = {
      dragging: false,
      openDialog: false,
      selectedKey: null,
    };
  }
  private hoverKey = (value: Key | null) => {
    this.props.hoverKey!(value);
  };

  private clickKey = (value: Key) => {
    if (value.keymap.isAny && !!value.keymap.keycodeInfo) {
      const info = value.keymap.keycodeInfo;
      this.setState({ openDialog: true, selectedKey: { ...info } });
    } else {
      this.props.selectKey!(value);
    }
  };

  private startDraggingKeycode(value: Key) {
    this.props.startDraggingKeycode!(value);
  }

  private endDraggingKeycode() {
    this.props.endDraggingKeycode!();
  }
  private closeDialog() {
    this.setState({ openDialog: false, selectedKey: null });
  }
  private clickOk(key: AnyKey) {
    console.log(this.props.index);
    console.log(key);
    this.props.updateAnyKey!(this.props.index!, key);
    this.setState({ openDialog: false, selectedKey: null });
  }
  render() {
    return (
      <React.Fragment>
        <div
          className={[
            'keycodekey',
            this.props.selected && 'selected',
            this.props.clickable && 'clickable',
            this.props.draggable && 'grabbable',
            this.state.dragging && 'dragging',
          ].join(' ')}
          onMouseEnter={this.hoverKey.bind(this, this.props.value)}
          onMouseLeave={this.hoverKey.bind(this, null)}
          onClick={this.clickKey.bind(this, this.props.value)}
          draggable={this.props.draggable}
          onDragStart={() => {
            this.setState({ dragging: true });
            this.startDraggingKeycode(this.props.value);
          }}
          onDragEnd={() => {
            this.setState({ dragging: false });
            this.endDraggingKeycode();
          }}
        >
          {this.props.value.meta && (
            <div className="code-label">{this.props.value.meta}</div>
          )}
          <div className="code-label">{this.props.value.label}</div>
        </div>
        <AnyKeyDialog
          open={this.state.openDialog}
          title="Edit your custom key"
          labelOk="Save"
          value={this.state.selectedKey}
          onClickCancel={this.closeDialog!.bind(this)}
          onClickOk={this.clickOk.bind(this)}
        />
      </React.Fragment>
    );
  }
}
