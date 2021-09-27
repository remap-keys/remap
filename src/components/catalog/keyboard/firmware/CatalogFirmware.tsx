import React from 'react';
import {
  CatalogFirmwareActionsType,
  CatalogFirmwareStateType,
} from './CatalogFirmware.container';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import './CatalogFirmware.scss';
import { IFirmware } from '../../../../services/storage/Storage';
import moment from 'moment';

type CatalogFirmwareState = {};
type OwnProps = {};
type CatalogFirmwareProps = OwnProps &
  Partial<CatalogFirmwareActionsType> &
  Partial<CatalogFirmwareStateType>;

export default class CatalogFirmware extends React.Component<
  CatalogFirmwareProps,
  CatalogFirmwareState
> {
  constructor(props: CatalogFirmwareProps | Readonly<CatalogFirmwareProps>) {
    super(props);
  }

  render() {
    return (
      <div className="catalog-firmware-wrapper">
        <div className="catalog-firmware-container">
          {this.props.definitionDocument!.firmwares.length > 0 ? (
            <div className="catalog-firmware-panel">
              {this.props.definitionDocument!.firmwares.map(
                (firmware, index) => (
                  <FirmwareCard key={`firmware-${index}`} firmware={firmware} />
                )
              )}{' '}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

type IFirmwareCardProps = {
  firmware: IFirmware;
};

function FirmwareCard(props: IFirmwareCardProps) {
  return (
    <Card variant="outlined" className="catalog-firmware-card">
      <CardContent>
        <Typography variant="h5" component="h2">
          {props.firmware.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {props.firmware.description}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {moment(props.firmware.created_at).format('MMMM Do YYYY, HH:mm:ss')} |
          SHA256: {props.firmware.hash}
        </Typography>
      </CardContent>
      <CardActions className="catalog-firmware-card-buttons">
        <Button size="small" color="primary">
          Download
        </Button>
      </CardActions>
    </Card>
  );
}
