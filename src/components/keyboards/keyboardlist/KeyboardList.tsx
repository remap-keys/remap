import './KeyboardList.scss';
import React from 'react';
import {
  KeyboardListActionsType,
  KeyboardListStateType,
} from './KeyboardList.container';
import { Button, Card, CardContent, Chip } from '@material-ui/core';
import {
  IKeyboardDefinitionDocument,
  IKeyboardDefinitionStatus,
  KeyboardDefinitionStatus,
} from '../../../services/storage/Storage';
import { hexadecimal } from '../../../utils/StringUtils';
import moment from 'moment-timezone';
import { ArrowDownward } from '@material-ui/icons';

type KeyboardListState = {};
type OwnProps = {};
type KeyboardListProps = OwnProps &
  Partial<KeyboardListActionsType> &
  Partial<KeyboardListStateType>;

export default class KeyboardList extends React.Component<
  KeyboardListProps,
  KeyboardListState
> {
  constructor(props: KeyboardListProps | Readonly<KeyboardListProps>) {
    super(props);
  }

  handleCreateButtonClick = () => {
    this.props.createKeyboard!();
  };

  render() {
    return (
      <div className="keyboard-list-wrapper">
        <div className="keyboard-list-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleCreateButtonClick}
          >
            +Keyboard
          </Button>
        </div>
        <div className="keyboard-list">
          {this.props.keyboardDefinitionDocuments!.map((doc, index) => (
            <div key={index} className="keyboard">
              <KeyboardRow doc={doc} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

type KeyboardProps = {
  doc: IKeyboardDefinitionDocument;
};

class KeyboardRow extends React.Component<KeyboardProps, any> {
  render() {
    const renderStatusBadge = (status: IKeyboardDefinitionStatus) => {
      switch (status) {
        case KeyboardDefinitionStatus.draft:
          return <Chip label={this.props.doc.status} size="small" />;
        case KeyboardDefinitionStatus.in_review:
          return (
            <Chip
              label={this.props.doc.status}
              size="small"
              className="status-badge-in-review"
            />
          );
        case KeyboardDefinitionStatus.rejected:
          return (
            <Chip
              label={this.props.doc.status}
              size="small"
              color="secondary"
            />
          );
        case KeyboardDefinitionStatus.approved:
          return (
            <Chip label={this.props.doc.status} size="small" color="primary" />
          );
        default:
          throw new Error(`Unknown Status: ${status}`);
      }
    };
    const jsonUrl = URL.createObjectURL(
      new Blob([this.props.doc.json], { type: 'application/json' })
    );
    return (
      <Card>
        <CardContent>
          <div className="keyboard-container">
            <div className="keyboard-container-left">
              <div className="keyboard-header">
                <h2 className="keyboard-name">{this.props.doc.name}</h2>
                {renderStatusBadge(this.props.doc.status)}
              </div>
              <div className="keyboard-meta">
                <div className="keyboard-meta-info">
                  <span className="keyboard-meta-info-label">Vendor ID:</span>
                  {hexadecimal(this.props.doc.vendorId, 4)}
                </div>
                <div className="keyboard-meta-info">
                  <span className="keyboard-meta-info-label">Product ID:</span>
                  {hexadecimal(this.props.doc.productId, 4)}
                </div>
                <div className="keyboard-meta-info">
                  <span className="keyboard-meta-info-label">
                    Product Name:
                  </span>
                  {this.props.doc.productName}
                </div>
              </div>
              <div className="keyboard-meta">
                <div className="keyboard-meta-info">
                  <span className="keyboard-meta-info-label">Created at:</span>
                  {moment(this.props.doc.createdAt).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </div>
                <div className="keyboard-meta-info">
                  <span className="keyboard-meta-info-label">Updated at: </span>
                  {moment(this.props.doc.updatedAt).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </div>
              </div>
            </div>
            <div className="keyboard-container-right">
              <Button
                color="primary"
                href={jsonUrl}
                download={`${this.props.doc.name}.json`}
              >
                <ArrowDownward />
                JSON
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  location.href = `/keyboards/${this.props.doc.id}`;
                }}
              >
                Detail
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
