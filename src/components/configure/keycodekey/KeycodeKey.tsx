import React from 'react';
import { buildModLabel } from '../customkey/Modifiers';
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
    this.props.updateAnyKey!(this.props.index!, key);
    this.setState({ openDialog: false, selectedKey: null });
  }
  render() {
    const draggable = this.props.draggable;
    const km = this.props.value.keymap;

    let modifierLabel = '';
    let holdLabel = '';
    if (km.kinds.includes('mod_tap')) {
      holdLabel = buildModLabel(km.modifiers || null);
    } else if (km.kinds.includes('layer_tap')) {
      holdLabel = km.option === undefined ? '' : `Layer(${km.option})`;
    } else if (km.kinds.includes('swap_hands')) {
      holdLabel = 'SWAP';
    } else {
      modifierLabel = buildModLabel(km.modifiers || null);
    }

    return (
      <React.Fragment>
        <div
          className={[
            'keycodekey',
            this.props.selected && 'selected',
            draggable && 'grabbable',
            this.state.dragging && 'dragging',
          ].join(' ')}
          onMouseEnter={this.hoverKey.bind(this, this.props.value)}
          onMouseLeave={this.hoverKey.bind(this, null)}
          onClick={this.clickKey.bind(this, this.props.value)}
          draggable={draggable}
          onDragStart={() => {
            this.setState({ dragging: true });
            this.startDraggingKeycode(this.props.value);
          }}
          onDragEnd={() => {
            this.setState({ dragging: false });
            this.endDraggingKeycode();
          }}
        >
          {0 === modifierLabel.length && 0 === holdLabel.length ? (
            <KeycodeKeyView label={this.props.value.label} />
          ) : (
            <KeycodeModifiersKeyView
              label={this.props.value.label}
              holdLabel={holdLabel}
              modifierLabel={modifierLabel}
            />
          )}
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

function KeycodeKeyView(props: { label: string }) {
  return <div className="code-label code-label-expand">{props.label}</div>;
}

function KeycodeModifiersKeyView(props: {
  label: string;
  modifierLabel: string;
  holdLabel: string;
}) {
  return (
    <React.Fragment>
      <div className="code-label modifier-label">{props.modifierLabel}</div>
      <div className="code-label">{props.label}</div>
      <div className="code-label modifier-label">{props.holdLabel}</div>
    </React.Fragment>
  );
}
