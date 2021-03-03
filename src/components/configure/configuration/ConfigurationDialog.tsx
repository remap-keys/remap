import React from 'react';
import Draggable from 'react-draggable';
import './ConfigurationDialog.scss';
import {
  ConfigurationDialogActionsType,
  ConfigurationDialogStateType,
} from './ConfigurationDialog.container';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Switch,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Alert, AlertTitle } from '@material-ui/lab';

import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { KeyboardDefinitionFormPart } from '../../common/keyboarddefformpart/KeyboardDefinitionFormPart';
import { hexadecimal } from '../../../utils/StringUtils';
import TabLighting, { Hsv } from './TabLighting';
import Lighting from './Lighting';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScZPhiXEG2VETCGZ2dYp4YbzzMlU62Crh1cNxPpFBkN4cCPbA/viewform?usp=pp_url&entry.661359702=${keyboard_name}&entry.135453541=${keyboard_id}';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  vendorId: number;
  productId: number;
  productName: string;
};

type ConfigurationDialogProps = OwnProps &
  Partial<ConfigurationDialogActionsType> &
  Partial<ConfigurationDialogStateType>;

type OwnState = {
  selectedMenuIndex: number;
  keyboardDefinition: KeyboardDefinitionSchema | null;
  keyboardDefinitionFile: string | null;
  needToInit: boolean;
};

export default class ConfigurationDialog extends React.Component<
  ConfigurationDialogProps,
  OwnState
> {
  private googleFormUrl: string = '';
  private githubUrl: string = '';
  private githubDisplayName: string = '';
  private showUnderglow: boolean = true;
  private showBacklight: boolean = true;
  private underglowEffects: [string, number][] = [];

  constructor(
    props: ConfigurationDialogProps | Readonly<ConfigurationDialogProps>
  ) {
    super(props);
    this.state = {
      selectedMenuIndex: 0,
      keyboardDefinition: null,
      keyboardDefinitionFile: null,
      needToInit: false,
    };
    this.initLighting();
  }

  get showLighting() {
    return this.showBacklight || this.showUnderglow;
  }

  shouldComponentUpdate(
    // eslint-disable-next-line no-unused-vars
    nextProps: ConfigurationDialogProps,
    // eslint-disable-next-line no-unused-vars
    nextState: OwnState
  ) {
    if (this.state.needToInit) {
      this.initLighting();
      this.setState({ needToInit: false });
    }
    return true;
  }

  private initLighting() {
    if (!this.props.keyboardDefinition!.lighting) {
      this.showUnderglow = false;
      this.showBacklight = false;
      return;
    }

    const lighting = new Lighting(this.props.keyboardDefinition?.lighting);
    this.showUnderglow = lighting.showUnderglow;
    this.showBacklight = lighting.showBacklight;
    this.underglowEffects = lighting.underglowEffects;
  }

  private onEnter() {
    if (this.props.keyboardDefinitionDocument) {
      this.googleFormUrl = GOOGLE_FORM_URL.replace(
        '${keyboard_name}',
        this.props.keyboardDefinitionDocument.name
      ).replace('${keyboard_id}', this.props.keyboardDefinitionDocument.id);

      this.githubUrl = this.props.keyboardDefinitionDocument.githubUrl;
      this.githubDisplayName = this.props.keyboardDefinitionDocument.githubDisplayName;
    }
  }

  private clearKeyboardDefinition() {
    this.setState({
      keyboardDefinition: null,
      keyboardDefinitionFile: null,
    });
  }

  private onClickApplyKeyboardDefinition() {
    this.setState({ needToInit: true });
    this.props.refreshKeyboardDefinition!(this.state.keyboardDefinition!);
    this.clearKeyboardDefinition();
  }

  private onChangeBacklight(backlight: {
    isBreathing?: boolean;
    brightness?: number /* 0-100 */;
  }) {
    if (backlight.isBreathing != undefined) {
      this.props.keyboard!.updateBacklightEffect(backlight.isBreathing);
    }

    if (backlight.brightness != undefined) {
      const brightness = Math.round(255 * (backlight.brightness / 100));
      this.props.keyboard!.updateBacklightBrightness(brightness);
    }
  }

  private onChangeUnderglow(underglow: {
    mode?: number;
    color?: Hsv; // h: 0-360, s: 0-100, v: 0-100
  }) {
    if (underglow.mode != undefined) {
      this.props.keyboard!.updateRGBLightEffect(underglow.mode);
    }

    if (underglow.color != undefined) {
      const hsv: Hsv = underglow.color;
      const hue = Math.round(255 * (hsv.h / 360));
      const sat = Math.round(255 * (hsv.s / 100));
      const brightness = Math.round(255 * (hsv.v / 100));

      this.props.keyboard!.updateRGBLightColor(hue, sat);
      this.props.keyboard!.updateRGBLightBrightness(brightness);
    }
  }

  // eslint-disable-next-line no-unused-vars
  private onLoadFile(
    keyboardDefinition: KeyboardDefinitionSchema,
    name: string
  ) {
    this.setState({
      keyboardDefinition: keyboardDefinition,
      keyboardDefinitionFile: name,
    });
  }

  render() {
    const hasKeyboardOptions = 0 < this.props.selectedKeyboardOptions!.length;
    const labels = this.props.keyboardLayoutOptions!;
    const selectedLayoutOptions = this.props.selectedKeyboardOptions!;

    const deviceInfo = this.props.keyboard!.getInformation();
    const keyboardDef = this.props.keyboardDefinition!;
    let panelIndex = 0;
    return (
      <Dialog
        open={this.props.open}
        maxWidth={'md'}
        onClose={() => {}}
        onEnter={() => {
          this.onEnter();
        }}
        PaperComponent={PaperComponent}
        className="layout-options-dialog"
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          Configuration
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="layout-options">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={this.state.selectedMenuIndex}
            onChange={(_, newValue) => {
              this.setState({ selectedMenuIndex: newValue });
            }}
            className="config-menu"
          >
            {hasKeyboardOptions && <Tab label="Layout options" />}
            {this.showLighting && <Tab label="Lighting" />}
            <Tab label="Import" />
            <Tab label="Info" />
          </Tabs>
          {hasKeyboardOptions && (
            <TabPanel value={this.state.selectedMenuIndex} index={panelIndex++}>
              <Grid container spacing={1}>
                {labels.map((options, index) => {
                  return (
                    <OptionRowComponent
                      key={index}
                      options={options}
                      selectedOption={selectedLayoutOptions[index]}
                      onChange={(choice: string | null) => {
                        this.props.setLayoutOption!(index, choice);
                      }}
                    />
                  );
                })}
              </Grid>
            </TabPanel>
          )}
          {this.showLighting && (
            <TabPanel value={this.state.selectedMenuIndex} index={panelIndex++}>
              <TabLighting
                underglowEffects={this.underglowEffects}
                keyboard={this.props.keyboard!}
                showBacklight={this.showBacklight}
                showUnderglow={this.showUnderglow}
                onChangeUnderglow={(underglow) => {
                  this.onChangeUnderglow(underglow);
                }}
                onChangeBacklight={(backlight) => {
                  this.onChangeBacklight(backlight);
                }}
              />
            </TabPanel>
          )}
          <TabPanel value={this.state.selectedMenuIndex} index={panelIndex++}>
            <KeyboardDefinitionFormPart
              messageHtml={`Please import <strong>${this.props.productName}</strong>'s defintion file (.json).`}
              validateDeviceIds={true}
              deviceVendorId={this.props.vendorId}
              deviceProductId={this.props.productId}
              onLoadFile={(kd, name) => {
                this.onLoadFile(kd, name);
              }}
              size="small"
            />

            {this.state.keyboardDefinition && (
              <Alert severity="success" className="import-success">
                <AlertTitle>{`Valid (${this.state.keyboardDefinitionFile})`}</AlertTitle>
                {`Will you apply the keyboard definition file?`}
                <div className="apply-definition">
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    disableElevation
                    onClick={this.clearKeyboardDefinition.bind(this)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={this.onClickApplyKeyboardDefinition.bind(this)}
                  >
                    Apply
                  </Button>
                </div>
              </Alert>
            )}
          </TabPanel>

          <TabPanel value={this.state.selectedMenuIndex} index={panelIndex++}>
            <Grid container spacing={1}>
              <Grid item xs={12} className="option-info-label">
                <h4>CONNECTED DEVICE</h4>
              </Grid>
              <InfoRow label="Product Name" value={deviceInfo.productName} />
              <InfoRow
                label="Vendor ID"
                value={hexadecimal(deviceInfo.vendorId, 4)}
              />
              <InfoRow
                label="Product ID"
                value={hexadecimal(deviceInfo.productId, 4)}
              />
              <Grid item xs={12} className="option-info-label">
                <h4>KEYBOARD DEFINITION</h4>
              </Grid>
              <InfoRow label="Name" value={keyboardDef.name} />
              <InfoRow label="Vendor ID" value={keyboardDef.vendorId} />
              <InfoRow label="Product ID" value={keyboardDef.productId} />
              <InfoRow
                label="Col x Row"
                value={`${keyboardDef.matrix.cols} x ${keyboardDef.matrix.rows}`}
              />
              <InfoRow
                label="Registered by"
                value={
                  <a href={this.githubUrl} target="_blank" rel="noreferrer">
                    {this.githubDisplayName}
                  </a>
                }
              />
              <Grid item xs={12} className="option-info-label">
                <div className="option-warning-message">
                  If you think that the person above does not have any rights
                  for the keyboard and the keyboard definition (in the case of
                  the person is not original keyboard designer or etc.), please
                  report it to the Remap team from{' '}
                  <a href={this.googleFormUrl} target="_blank" rel="noreferrer">
                    this form
                  </a>
                  .
                </div>
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>
      </Dialog>
    );
  }
}

function TabPanel(props: { value: number; index: number; children: any }) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className="tab-panel"
    >
      {value === index && <React.Fragment>{children}</React.Fragment>}
    </div>
  );
}

type OptionRowType = {
  options: string | string[];
  selectedOption: string | null;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string | null) => void;
};
function OptionRowComponent(props: OptionRowType) {
  if (typeof props.options == 'string') {
    const option: string = props.options;
    return (
      <React.Fragment>
        <Grid item xs={6} className="option-label">
          {props.options}
        </Grid>
        <Grid item xs={6} className="option-value">
          <Switch
            checked={!!props.selectedOption}
            onChange={(e) => {
              props.onChange(e.target.checked ? option : null);
            }}
            color="primary"
            name="checkedB"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Grid>
      </React.Fragment>
    );
  }

  const label = props.options[0];
  const choices: string[] = props.options.slice(1);
  return (
    <React.Fragment>
      <Grid item xs={6} className="option-label">
        {props.options[0]}
      </Grid>
      <Grid item xs={6} className="option-value">
        <Select
          value={props.selectedOption}
          onChange={(e) => {
            props.onChange(e.target.value as string);
          }}
          className="option-value-select"
        >
          {choices.map((choice, index) => {
            return (
              <MenuItem key={`${label}${index}`} value={choice}>
                {choice}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
    </React.Fragment>
  );
}

function InfoRow(props: { label: string; value: string | React.ReactNode }) {
  return (
    <React.Fragment>
      <Grid item xs={6} className="option-info-label">
        {props.label}
      </Grid>
      <Grid item xs={6} className="option-info-value">
        {props.value}
      </Grid>
    </React.Fragment>
  );
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
