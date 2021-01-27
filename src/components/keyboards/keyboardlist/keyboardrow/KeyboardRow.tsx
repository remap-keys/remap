import {
  IKeyboardDefinitionDocument,
  IKeyboardDefinitionStatus,
  KeyboardDefinitionStatus,
} from '../../../../services/storage/Storage';
import React from 'react';
import { Button, Card, CardContent, Chip } from '@material-ui/core';
import { hexadecimal } from '../../../../utils/StringUtils';
import moment from 'moment-timezone';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

type KeyboardProps = {
  doc: IKeyboardDefinitionDocument;
};

class KeyboardRow extends React.Component<KeyboardProps, any> {
  render() {
    const renderStatusBadge = (status: IKeyboardDefinitionStatus) => {
      switch (status) {
        case KeyboardDefinitionStatus.draft:
        case KeyboardDefinitionStatus.in_review:
          return <Chip label={this.props.doc.status} size="small" />;
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
              <Button color="primary">
                <ArrowDownwardIcon />
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

export default KeyboardRow;
