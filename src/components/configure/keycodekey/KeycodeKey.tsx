import React from 'react';
import AnyKeyDialog from './any/AnyKeyEditDialog';
import {
  KeycodeKeyActionsType,
  KeycodeKeyStateType,
} from './KeycodeKey.container';
import './KeycodeKey.scss';
import { Key } from './KeyGen';
import { Edit as EditIcon } from '@mui/icons-material';

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
  clickable?: boolean;
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
    if (!this.props.clickable) return;

    if (value.keymap.isAny) {
      if (value.keymap.keycodeInfo) {
        const info = value.keymap.keycodeInfo;
        this.setState({ openDialog: true, selectedKey: { ...info } });
      }
    } else {
      if (value.keymap.kinds.includes('macro')) {
        this.props.selectMacroKey!(value);
      } else if (value.keymap.kinds.includes('bmp-extended')) {
        this.props.selectBmpExtendedKey!(value);
      } else {
        this.props.selectKey!(value);
      }
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
    const key: Key = this.props.value;
    const label = key.label;
    const modifierLabel = key.meta;
    const modifierRightLabel = key.metaRight;
    const holdLabel = '';

    return (
      <React.Fragment>
        <div
          className={[
            'keycodekey',
            this.props.selected && 'selected',
            draggable && 'grabbable',
            this.props.clickable && 'clickable',
            this.state.dragging && 'dragging',
          ].join(' ')}
          onMouseEnter={this.hoverKey.bind(this, this.props.value)}
          onMouseLeave={this.hoverKey.bind(this, null)}
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
          <KeycodeKeyView
            label={label}
            holdLabel={holdLabel}
            modifierLabel={modifierLabel}
            modifierRightLabel={modifierRightLabel}
          />
          {this.props.clickable ? (
            <div
              className="edit-icon"
              onClick={this.clickKey.bind(this, this.props.value)}
            >
              <EditIcon color="action" fontSize="small" />
            </div>
          ) : null}
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

type KeycodeKeyViewProps = {
  label: string;
  modifierLabel?: string;
  modifierRightLabel?: string;
  holdLabel?: string;
};
function KeycodeKeyView(props: KeycodeKeyViewProps) {
  if (props.modifierRightLabel) {
    return (
      <KeycodeTopRightKeyView
        label={props.label}
        modifierLabel={props.modifierLabel || ''}
        modifierRightLabel={props.modifierRightLabel || ''}
      />
    );
  } else if (props.modifierLabel || props.holdLabel) {
    return (
      <KeycodeModifiersKeyView
        label={props.label}
        modifierLabel={props.modifierLabel || ''}
        holdLabel={props.holdLabel || ''}
      />
    );
  } else {
    return <div className="code-label code-label-expand">{props.label}</div>;
  }
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

function KeycodeTopRightKeyView(props: {
  label: string;
  modifierLabel: string;
  modifierRightLabel: string;
}) {
  return (
    <React.Fragment>
      <div className="code-label modifier-label">{props.modifierLabel}</div>
      <div className="code-label">
        <div className="code-row"></div>
        <div className="code-row code-row-center">{props.label}</div>
        <div className="code-row code-row-right">
          {props.modifierRightLabel}
        </div>
      </div>
      <div className="code-label modifier-label"></div>
    </React.Fragment>
  );
}
