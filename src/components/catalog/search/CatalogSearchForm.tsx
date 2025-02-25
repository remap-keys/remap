import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
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
import { t } from 'i18next';

type CatalogSearchFormState = {};
type OwnProps = {
  features: IKeyboardFeatures[];
  keyword: string;
  buildSupport: boolean;
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

  onChangeKeyCount(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardKeyCountType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_KEY_COUNT_TYPE);
  }

  onChangeSplitType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardSplitType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_SPLIT_TYPE);
  }

  onChangeStaggeredType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardStaggeredType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_STAGGERED_TYPE);
  }

  onChangeLedType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardLedType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_LED_TYPE);
  }

  onChangeKeySwitchType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardKeySwitchType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_KEY_SWITCH_TYPE);
  }

  onChangeHotswapType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardHotswapType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_HOTSWAP_TYPE);
  }

  onChangeOledType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardOledType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_OLED_TYPE);
  }

  onChangeSpeakerType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardSpeakerType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_SPEAKER_TYPE);
  }

  onChangeWirelessType(event: SelectChangeEvent) {
    const value = event.target.value as
      | IKeyboardWirelessType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_WIRELESS_TYPE);
  }

  onChangeBuildSupport(event: SelectChangeEvent) {
    const value = event.target.value === 'buildSupport';
    this.props.updateBuildSupport!(value);
  }

  // eslint-disable-next-line no-undef
  onChangeKeyword(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateKeyword!(event.target.value);
  }

  onChangeOrganizationId(event: SelectChangeEvent) {
    if (event.target.value === '---') {
      this.props.updateOrganizationId!(undefined);
    } else {
      this.props.updateOrganizationId!(event.target.value);
    }
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
            variant="standard"
            label={t('Keyboard Name')}
            fullWidth={true}
            value={this.props.keyword}
            onChange={this.onChangeKeyword.bind(this)}
            onKeyDown={this.onKeyDownKeyword.bind(this)}
            size="small"
          />
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-organization">
              {t('Organization')}
            </InputLabel>
            <Select
              labelId="catalog-search-organization"
              label={t('Organization')}
              value={this.props.organizationId || '---'}
              onChange={this.onChangeOrganizationId.bind(this)}
              size="small"
            >
              <MenuItem key="catalog-search-organization-undefined" value="---">
                ---
              </MenuItem>
              {this.props.organizations!.map((organization) => (
                <MenuItem
                  key={`catalog-search-organization-${organization.id}`}
                  value={organization.id}
                >
                  {organization.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-build">
              {t('Build Firmware Support')}
            </InputLabel>
            <Select
              labelId="catalog-search-build"
              label={t('Build Firmware Support')}
              value={this.props.buildSupport ? 'buildSupport' : '---'}
              onChange={this.onChangeBuildSupport.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="buildSupport">{t('Supported')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-key-count">
              {t('Number of Keys')}
            </InputLabel>
            <Select
              labelId="catalog-search-key-count"
              label={t('Number of Keys')}
              value={this.getFeatureValue(ALL_KEY_COUNT_TYPE)}
              onChange={this.onChangeKeyCount.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="over_100">{t('Over 100%')}</MenuItem>
              <MenuItem value="100">100%</MenuItem>
              <MenuItem value="90">90%</MenuItem>
              <MenuItem value="80">80%</MenuItem>
              <MenuItem value="70">70%</MenuItem>
              <MenuItem value="60">60%</MenuItem>
              <MenuItem value="50">50%</MenuItem>
              <MenuItem value="40">40%</MenuItem>
              <MenuItem value="30">30%</MenuItem>
              <MenuItem value="macro">{t('Macro')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-split">
              {t('Integrated/Split')}
            </InputLabel>
            <Select
              labelId="catalog-search-split"
              label={t('Integrated/Split')}
              value={this.getFeatureValue(ALL_SPLIT_TYPE)}
              onChange={this.onChangeSplitType.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="integrated">{t('Integrated')}</MenuItem>
              <MenuItem value="split">{t('Split')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-staggered">
              {t('Staggered')}
            </InputLabel>
            <Select
              labelId="catalog-search-staggered"
              label={t('Staggered')}
              value={this.getFeatureValue(ALL_STAGGERED_TYPE)}
              onChange={this.onChangeStaggeredType.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="row_staggered">{t('Row Staggered')}</MenuItem>
              <MenuItem value="column_staggered">
                {t('Column Staggered')}
              </MenuItem>
              <MenuItem value="ortholinear">{t('Ortholinear')}</MenuItem>
              <MenuItem value="symmetrical">{t('Symmetrical')}</MenuItem>
              <MenuItem value="alice">{t('Alice')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-lighting">
              {t('Lighting')}
            </InputLabel>
            <Select
              labelId="catalog-search-lighting"
              label={t('Lighting')}
              value={this.getFeatureValue(ALL_LED_TYPE)}
              onChange={this.onChangeLedType.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="backlight">{t('Backlight')}</MenuItem>
              <MenuItem value="underglow">{t('Underglow')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-key-switch">
              {t('Key Switch')}
            </InputLabel>
            <Select
              labelId="catalog-search-key-switch"
              label={t('Key Switch')}
              value={this.getFeatureValue(ALL_KEY_SWITCH_TYPE)}
              onChange={this.onChangeKeySwitchType.bind(this)}
              size="small"
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
              <MenuItem value="gateron_low_profile">
                Gateron Low Profile
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-hot-swap">
              {t('Hot Swap')}
            </InputLabel>
            <Select
              labelId="catalog-search-hot-swap"
              label={t('Hot Swap')}
              value={this.getFeatureValue(ALL_HOTSWAP_TYPE)}
              onChange={this.onChangeHotswapType.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="hot_swap">{t('Supported')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-oled">OLED</InputLabel>
            <Select
              labelId="catalog-search-oled"
              label="OLED"
              value={this.getFeatureValue(ALL_OLED_TYPE)}
              onChange={this.onChangeOledType.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="oled">{t('Supported')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-speaker">{t('Speaker')}</InputLabel>
            <Select
              labelId="catalog-search-speaker"
              label={t('Speaker')}
              value={this.getFeatureValue(ALL_SPEAKER_TYPE)}
              onChange={this.onChangeSpeakerType.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="speaker">{t('Supported')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-condition">
          <FormControl fullWidth={true}>
            <InputLabel id="catalog-search-wireless">
              {t('Wireless')}
            </InputLabel>
            <Select
              labelId="catalog-search-wireless"
              label={t('Wireless')}
              value={this.getFeatureValue(ALL_WIRELESS_TYPE)}
              onChange={this.onChangeWirelessType.bind(this)}
              size="small"
            >
              <MenuItem value="---">---</MenuItem>
              <MenuItem value="wireless">{t('Supported')}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="catalog-search-buttons">
          <Button variant="text" onClick={this.onClickClear.bind(this)}>
            {t('Clear')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.onClickSearch.bind(this)}
          >
            {t('Search')}
          </Button>
        </div>
      </div>
    );
  }
}
