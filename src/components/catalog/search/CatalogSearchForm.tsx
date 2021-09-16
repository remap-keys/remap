import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import React from 'react';
import {
  ALL_HOTSWAP_TYPE,
  ALL_KEY_COUNT_TYPE,
  ALL_KEY_SWITCH_TYPE,
  ALL_LED_TYPE,
  ALL_OLED_TYPE,
  ALL_SPEAKER_TYPE,
  ALL_SPLIT_TYPE,
  ALL_STAGGERED_TYPE,
  ALL_WIRELESS_TYPE,
  CONDITION_NOT_SELECTED,
  IConditionNotSelected,
  IKeyboardFeatures,
  IKeyboardHotswapType,
  IKeyboardKeyCountType,
  IKeyboardKeySwitchType,
  IKeyboardLedType,
  IKeyboardOledType,
  IKeyboardSpeakerType,
  IKeyboardSplitType,
  IKeyboardStaggeredType,
  IKeyboardWirelessType,
} from '../../../store/state';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import {
  CatalogSearchFormActionsType,
  CatalogSearchFormStateType,
} from './CatalogSearchForm.container';
import './CatalogSearchForm.scss';

type CatalogSearchFormState = {};
type OwnProps = {
  features: IKeyboardFeatures[];
  keyword: string;
  onSubmit?: () => void;
};

type CatalogSearchFormProps = OwnProps &
  Partial<CatalogSearchFormActionsType> &
  Partial<CatalogSearchFormStateType>;

export default class CatalogSearchForm extends React.Component<
  CatalogSearchFormProps,
  CatalogSearchFormState
> {
  constructor(
    props: CatalogSearchFormProps | Readonly<CatalogSearchFormProps>
  ) {
    super(props);
    this.state = {};
  }

  private getFeatureValue(
    targetFeatures: readonly IKeyboardFeatures[]
  ): IKeyboardFeatures | IConditionNotSelected {
    return (
      this.props.features!.find((feature) => {
        for (const target of targetFeatures) {
          if (feature === target) {
            return true;
          }
        }
        return false;
      }) || CONDITION_NOT_SELECTED
    );
  }

  onChangeKeyCount(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardKeyCountType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_KEY_COUNT_TYPE);
  }

  onChangeSplitType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardSplitType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_SPLIT_TYPE);
  }

  onChangeStaggeredType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardStaggeredType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_STAGGERED_TYPE);
  }

  onChangeLedType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardLedType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_LED_TYPE);
  }

  onChangeKeySwitchType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardKeySwitchType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_KEY_SWITCH_TYPE);
  }

  onChangeHotswapType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardHotswapType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_HOTSWAP_TYPE);
  }

  onChangeOledType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardOledType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_OLED_TYPE);
  }

  onChangeSpeakerType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardSpeakerType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_SPEAKER_TYPE);
  }

  onChangeWirelessType(
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) {
    const value = event.target.value as
      | IKeyboardWirelessType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_WIRELESS_TYPE);
  }

  // eslint-disable-next-line no-undef
  onChangeKeyword(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateKeyword!(event.target.value);
  }

  onClickSearch() {
    this.props.search!();
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  onKeyDownKeyword(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      this.props.search!();
    }
  }

  onClickClear() {
    sendEventToGoogleAnalytics('catalog/clear_search_condition');
    this.props.resetSearchConditions!();
  }

  render() {
    return (
      <div className="catalog-search-condition-container">
        <div className="catalog-search-condition">
          <TextField
            label="Keyboard Name"
            fullWidth={true}
            value={this.props.keyword}
            onChange={this.onChangeKeyword.bind(this)}
            onKeyDown={this.onKeyDownKeyword.bind(this)}
          />
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-key-count">
              Number of Keys
            </InputLabel>
            <Select
              labelId="catalog-search-key-count"
              value={this.getFeatureValue(ALL_KEY_COUNT_TYPE)}
              onChange={this.onChangeKeyCount.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="over_100">Over 100%</MenuItem>
              <MenuItem value="100">100%</MenuItem>
              <MenuItem value="90">90%</MenuItem>
              <MenuItem value="80">80%</MenuItem>
              <MenuItem value="70">70%</MenuItem>
              <MenuItem value="60">60%</MenuItem>
              <MenuItem value="50">50%</MenuItem>
              <MenuItem value="40">40%</MenuItem>
              <MenuItem value="30">30%</MenuItem>
              <MenuItem value="macro">Macro</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-split">Integrated/Split</InputLabel>
            <Select
              labelId="catalog-search-split"
              value={this.getFeatureValue(ALL_SPLIT_TYPE)}
              onChange={this.onChangeSplitType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="integrated">Integrated</MenuItem>
              <MenuItem value="split">Split</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-staggered">Staggered</InputLabel>
            <Select
              labelId="catalog-search-staggered"
              value={this.getFeatureValue(ALL_STAGGERED_TYPE)}
              onChange={this.onChangeStaggeredType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="row_staggered">Row Staggered</MenuItem>
              <MenuItem value="column_staggered">Column Staggered</MenuItem>
              <MenuItem value="ortholinear">Ortholinear</MenuItem>
              <MenuItem value="symmetrical">Symmetrical</MenuItem>
              <MenuItem value="alice">Alice</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-lighting">Lighting</InputLabel>
            <Select
              labelId="catalog-search-lighting"
              value={this.getFeatureValue(ALL_LED_TYPE)}
              onChange={this.onChangeLedType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="backlight">Backlight</MenuItem>
              <MenuItem value="underglow">Underglow</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-key-switch">Key Switch</InputLabel>
            <Select
              labelId="catalog-search-key-switch"
              value={this.getFeatureValue(ALL_KEY_SWITCH_TYPE)}
              onChange={this.onChangeKeySwitchType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="cherry_mx">Cherry MX Compatible</MenuItem>
              <MenuItem value="kailh_choc">Kailh Choc V1</MenuItem>
              <MenuItem value="kailh_choc_v2">Kailh Choc V2</MenuItem>
              <MenuItem value="kailh_mid_height">Kailh Mid-height</MenuItem>
              <MenuItem value="alps">ALPS</MenuItem>
              <MenuItem value="outemulp">Outemu Low Profile</MenuItem>
              <MenuItem value="capacitive_sensing_type">
                Capacitive Sensing Type
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-hot-swap">Hot Swap</InputLabel>
            <Select
              labelId="catalog-search-hot-swap"
              value={this.getFeatureValue(ALL_HOTSWAP_TYPE)}
              onChange={this.onChangeHotswapType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="hot_swap">Supported</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-oled">OLED</InputLabel>
            <Select
              labelId="catalog-search-oled"
              value={this.getFeatureValue(ALL_OLED_TYPE)}
              onChange={this.onChangeOledType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="oled">Supported</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-speaker">Speaker</InputLabel>
            <Select
              labelId="catalog-search-speaker"
              value={this.getFeatureValue(ALL_SPEAKER_TYPE)}
              onChange={this.onChangeSpeakerType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="speaker">Supported</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-wireless">Wireless</InputLabel>
            <Select
              labelId="catalog-search-wireless"
              value={this.getFeatureValue(ALL_WIRELESS_TYPE)}
              onChange={this.onChangeWirelessType.bind(this)}
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="wireless">Supported</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-buttons">
          <Button variant="text" onClick={this.onClickClear.bind(this)}>
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.onClickSearch.bind(this)}
          >
            Search
          </Button>
        </div>
      </div>
    );
  }
}
