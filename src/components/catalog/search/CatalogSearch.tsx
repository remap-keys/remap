import React, { useState } from 'react';
import {
  CatalogSearchActionsType,
  CatalogSearchStateType,
} from './CatalogSearch.container';
import './CatalogSearch.scss';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CardMedia,
} from '@material-ui/core';
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
import {
  getGitHubUserDisplayName,
  IKeyboardDefinitionDocument,
} from '../../../services/storage/Storage';
import { Pagination } from '@material-ui/lab';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import { hexadecimal } from '../../../utils/StringUtils';
import FeatureList from '../../common/features/FeatureList';

type CatalogSearchState = {};
type OwnProps = {};
type CatalogSearchProps = OwnProps &
  Partial<CatalogSearchActionsType> &
  Partial<CatalogSearchStateType>;

class CatalogSearch extends React.Component<
  CatalogSearchProps,
  CatalogSearchState
> {
  constructor(props: CatalogSearchProps | Readonly<CatalogSearchProps>) {
    super(props);
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

  onChangeKeyword(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateKeyword!(event.target.value);
  }

  onClickSearch() {
    this.props.search!();
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
    const getFeatureValue = (
      targetFeatures: readonly IKeyboardFeatures[]
    ): IKeyboardFeatures | IConditionNotSelected => {
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
    };

    return (
      <div className="catalog-search-wrapper">
        <div className="catalog-search-container">
          <Grid container>
            <Grid item sm={3}>
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
                      value={getFeatureValue(ALL_KEY_COUNT_TYPE)}
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
                    <InputLabel id="catalog-search-split">
                      Integrated/Split
                    </InputLabel>
                    <Select
                      labelId="catalog-search-split"
                      value={getFeatureValue(ALL_SPLIT_TYPE)}
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
                    <InputLabel id="catalog-search-staggered">
                      Staggered
                    </InputLabel>
                    <Select
                      labelId="catalog-search-staggered"
                      value={getFeatureValue(ALL_STAGGERED_TYPE)}
                      onChange={this.onChangeStaggeredType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="row_staggered">Row Staggered</MenuItem>
                      <MenuItem value="column_staggered">
                        Column Staggered
                      </MenuItem>
                      <MenuItem value="ortholinear">Ortholinear</MenuItem>
                      <MenuItem value="symmetrical">Symmetrical</MenuItem>
                      <MenuItem value="alice">Alice</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-lighting">
                      Lighting
                    </InputLabel>
                    <Select
                      labelId="catalog-search-lighting"
                      value={getFeatureValue(ALL_LED_TYPE)}
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
                    <InputLabel id="catalog-search-key-switch">
                      Key Switch
                    </InputLabel>
                    <Select
                      labelId="catalog-search-key-switch"
                      value={getFeatureValue(ALL_KEY_SWITCH_TYPE)}
                      onChange={this.onChangeKeySwitchType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="cherry_mx">
                        Cherry MX Compatible
                      </MenuItem>
                      <MenuItem value="kailh_choc">Kailh Choc V1</MenuItem>
                      <MenuItem value="kailh_choc_v2">Kailh Choc V2</MenuItem>
                      <MenuItem value="kailh_mid_height">
                        Kailh Mid-height
                      </MenuItem>
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
                    <InputLabel id="catalog-search-hot-swap">
                      Hot Swap
                    </InputLabel>
                    <Select
                      labelId="catalog-search-hot-swap"
                      value={getFeatureValue(ALL_HOTSWAP_TYPE)}
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
                      value={getFeatureValue(ALL_OLED_TYPE)}
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
                      value={getFeatureValue(ALL_SPEAKER_TYPE)}
                      onChange={this.onChangeSpeakerType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="speaker">Supported</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-wireless">
                      Wireless
                    </InputLabel>
                    <Select
                      labelId="catalog-search-wireless"
                      value={getFeatureValue(ALL_WIRELESS_TYPE)}
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
            </Grid>
            <Grid item sm={9}>
              <SearchResult definitionDocuments={this.props.searchResult!} />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default CatalogSearch;

const SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE = 5;

type SearchResultProps = {
  definitionDocuments: IKeyboardDefinitionDocument[];
};

function SearchResult(props: SearchResultProps) {
  const [offset, setOffset] = useState(0);

  const onChangePage = (event: any, page: number): void => {
    setOffset((page - 1) * SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE);
  };

  return (
    <div className="catalog-search-result-container">
      {props.definitionDocuments
        .slice(offset, offset + SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE)
        .map((result) => (
          <KeyboardCard
            definition={result}
            key={`search-result-${result.id}`}
          />
        ))}
      <div className="catalog-search-result-pagination">
        <Pagination
          count={Math.ceil(
            props.definitionDocuments.length /
              SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE
          )}
          page={Math.floor(offset / SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE) + 1}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}

type KeyboardCardProps = {
  definition: IKeyboardDefinitionDocument;
};

function KeyboardCard(props: KeyboardCardProps) {
  const onClickCard = () => {
    sendEventToGoogleAnalytics('catalog/open_from_search');
    return true;
  };

  return (
    <Card className="catalog-search-result-card">
      <a
        href={`/catalog/${props.definition.id}`}
        onClick={onClickCard}
        rel="noreferrer"
      >
        {props.definition.imageUrl ? (
          <CardMedia
            image={props.definition.imageUrl}
            className="catalog-search-result-card-image"
          />
        ) : (
          <div className="catalog-search-result-card-no-image">
            <PhotoLibraryIcon />
            No Image
          </div>
        )}
      </a>

      <CardContent className="catalog-search-result-card-container">
        <a
          href={`/catalog/${props.definition.id}`}
          onClick={onClickCard}
          rel="noreferrer"
        >
          <div className="catalog-search-result-card-wrapper">
            <div className="catalog-search-result-card-content">
              <div className="catalog-search-result-card-header">
                <div className="catalog-search-result-card-header-name-container">
                  <h2 className="catalog-search-result-card-name">
                    {props.definition.name}
                  </h2>
                  <div className="catalog-search-result-card-header-name-row">
                    <Typography variant="caption">
                      VID: {hexadecimal(props.definition.vendorId, 4)} / PID:{' '}
                      {hexadecimal(props.definition.productId, 4)}
                    </Typography>
                    <Typography variant="caption">
                      Designed by {getGitHubUserDisplayName(props.definition)}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="catalog-search-result-card-features">
                <FeatureList
                  definitionId={props.definition.id}
                  features={props.definition.features}
                  size="small"
                />
              </div>
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
