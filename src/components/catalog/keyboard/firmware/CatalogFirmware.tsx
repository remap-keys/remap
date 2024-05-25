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
} from '@mui/material';
import './CatalogFirmware.scss';
import {
  IFirmware,
  IKeyboardDefinitionDocument,
} from '../../../../services/storage/Storage';
import moment from 'moment';
import { sendEventToGoogleAnalytics } from '../../../../utils/GoogleAnalytics';
import { ICatalogPhase } from '../../../../store/state';
import { hexadecimal } from '../../../../utils/StringUtils';

type CatalogFirmwareState = {
  supportedBrowser: boolean;
};
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
    this.state = {
      supportedBrowser: true,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    if ((navigator as any).serial === undefined) {
      this.setState({
        supportedBrowser: false,
      });
      return;
    }
  }

  onClickFlash(firmware: IFirmware) {
    this.props.flashFirmwareDialog!.open(
      this.props.definitionDocument!,
      firmware,
    );
  }

  render() {
    const sortedFirmwares = this.props
      .definitionDocument!.firmwares.slice()
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    return (
      <React.Fragment>
        <div className="catalog-firmware-wrapper">
          <div className="catalog-firmware-container">
            <div className="catalog-firmware-panel">
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Device Information</Typography>
                  <Typography variant="body2">
                    <span className="catalog-firmware-device-info-item">
                      Vendor ID:{' '}
                      {hexadecimal(this.props.definitionDocument!.vendorId, 4)}
                    </span>{' '}
                    /{' '}
                    <span className="catalog-firmware-device-info-item">
                      Product ID:{' '}
                      {hexadecimal(this.props.definitionDocument!.productId, 4)}
                    </span>{' '}
                    /{' '}
                    <span className="catalog-firmware-device-info-item">
                      PRODUCT: {this.props.definitionDocument!.productName}
                    </span>
                  </Typography>
                </CardContent>
              </Card>
            </div>
            {this.props.definitionDocument!.firmwares.length > 0 ? (
              <div className="catalog-firmware-panel">
                <div className="catalog-firmware-total-download-count">
                  <Typography variant="body2" align="right">
                    Total Download Count:{' '}
                    {this.props.definitionDocument!.totalFirmwareDownloadCount}
                    {' / '}
                    Total Flash Count:{' '}
                    {this.props.definitionDocument!.totalFirmwareFlashCount}
                  </Typography>
                </div>
                {sortedFirmwares.map((firmware, index) => (
                  <FirmwareCard
                    key={`firmware-${index}`}
                    firmware={firmware}
                    fetchFirmwareFileBlob={this.props.fetchFirmwareFileBlob!}
                    definitionDocument={this.props.definitionDocument!}
                    updateKeyboard={this.props.updateKeyboard!}
                    onClickFlash={() => {
                      this.onClickFlash(firmware);
                    }}
                    supportedBrowser={this.state.supportedBrowser}
                  />
                ))}
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
      </React.Fragment>
    );
  }
}

type IFirmwareCardProps = {
  firmware: IFirmware;
  fetchFirmwareFileBlob: (
    // eslint-disable-next-line no-unused-vars
    firmwareFilePath: string,
    // eslint-disable-next-line no-unused-vars
    callback: (blob: any) => void,
  ) => void;
  definitionDocument: IKeyboardDefinitionDocument;
  // eslint-disable-next-line no-unused-vars
  updateKeyboard: (definitionId: string, nextPhase: ICatalogPhase) => void;
  // eslint-disable-next-line no-unused-vars
  onClickFlash: (firmware: IFirmware) => void;
  supportedBrowser: boolean;
};

function FirmwareCard(props: IFirmwareCardProps) {
  const onClickDownload = () => {
    sendEventToGoogleAnalytics('catalog/download_firmware', {
      vendor_id: props.definitionDocument.vendorId,
      product_id: props.definitionDocument.productId,
      product_name: props.definitionDocument.productName,
    });
    props.fetchFirmwareFileBlob(props.firmware.filename, (blob: any) => {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.download = props.firmware.filename.substring(
        props.firmware.filename.lastIndexOf('/') + 1,
      );
      a.href = downloadUrl;
      a.click();
      a.remove();
      props.updateKeyboard(props.definitionDocument.id, 'firmware');
    });
  };

  const onClickFlash = () => {
    props.onClickFlash(props.firmware);
  };

  return (
    <React.Fragment>
      <Card variant="outlined" className="catalog-firmware-card">
        <CardContent>
          <Typography variant="h5" component="h2">
            {props.firmware.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {props.firmware.description}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            className="catalog-firmware-card-caption"
          >
            {moment(props.firmware.created_at).format('MMMM Do YYYY, HH:mm:ss')}{' '}
            | SHA256: {props.firmware.hash}
          </Typography>
        </CardContent>
        <CardActions className="catalog-firmware-card-buttons">
          {props.supportedBrowser && props.firmware.flash_support ? (
            <Button size="small" color="primary" onClick={onClickFlash}>
              Flash
            </Button>
          ) : null}
          <Button
            size="small"
            href={props.firmware.sourceCodeUrl}
            target="_blank"
            rel="noreferrer"
          >
            Source Code
          </Button>
          <Button size="small" color="primary" onClick={onClickDownload}>
            Download
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}
