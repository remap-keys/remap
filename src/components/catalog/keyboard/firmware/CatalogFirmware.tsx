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
                  <FirmwareCard
                    key={`firmware-${index}`}
                    firmware={firmware}
                    fetchFirmwareFileBlob={this.props.fetchFirmwareFileBlob!}
                  />
                )
              )}{' '}
            </div>
          ) : (
            <div className="catalog-firmware-nothing">
              <Typography variant="body1">
                There is no firmware provided for this keyboard on Remap.
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  }
}

type IFirmwareCardProps = {
  firmware: IFirmware;
  fetchFirmwareFileBlob: (
    // eslint-disable-next-line no-unused-vars
    firmwareFilePath: string,
    // eslint-disable-next-line no-unused-vars
    callback: (blob: any) => void
  ) => void;
};

function FirmwareCard(props: IFirmwareCardProps) {
  const onClickDownload = () => {
    props.fetchFirmwareFileBlob(props.firmware.filename, (blob: any) => {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.download = props.firmware.filename.substring(
        props.firmware.filename.lastIndexOf('/') + 1
      );
      a.href = downloadUrl;
      a.click();
      a.remove();
    });
  };

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
        <Button size="small" color="primary" onClick={onClickDownload}>
          Download
        </Button>
      </CardActions>
    </Card>
  );
}
