import React from 'react';
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
  Chip,
  Button,
} from '@material-ui/core';
import {
  ALL_HOTSWAP_TYPE,
  ALL_KEY_SWITCH_TYPE,
  ALL_LED_TYPE,
  ALL_MCU_TYPE,
  ALL_OLED_TYPE,
  ALL_SPEAKER_TYPE,
  ALL_SPLIT_TYPE,
  ALL_STAGGERED_TYPE,
  CONDITION_NOT_SELECTED,
  IConditionNotSelected,
  IKeyboardFeatures,
  IKeyboardHotswapType,
  IKeyboardKeySwitchType,
  IKeyboardLedType,
  IKeyboardMcuType,
  IKeyboardOledType,
  IKeyboardSpeakerType,
  IKeyboardSplitType,
  IKeyboardStaggeredType,
} from '../../../store/state';
import { IKeyboardDefinitionDocument } from '../../../services/storage/Storage';

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

  onChangeMcuType(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const value = event.target.value as
      | IKeyboardMcuType
      | IConditionNotSelected;
    this.props.updateFeatures!(value, ALL_MCU_TYPE);
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
            <Grid item xs={3}>
              <div className="catalog-search-condition-container">
                {/*<div className="catalog-search-condition">*/}
                {/*  <TextField*/}
                {/*    label="Keyword"*/}
                {/*    fullWidth={true}*/}
                {/*    value="Lunakey Mini"*/}
                {/*  />*/}
                {/*</div>*/}
                {/*<div className="catalog-search-condition">*/}
                {/*  <FormControl fullWidth={true}>*/}
                {/*    <InputLabel id="catalog-search-designer">*/}
                {/*      Keyboard Designer*/}
                {/*    </InputLabel>*/}
                {/*    <Select labelId="catalog-search-designer" value={0}>*/}
                {/*      <MenuItem value={0}>Yoichiro Tanaka</MenuItem>*/}
                {/*      <MenuItem>Salicylic-acid3</MenuItem>*/}
                {/*    </Select>*/}
                {/*  </FormControl>*/}
                {/*</div>*/}
                {/*<div className="catalog-search-condition">*/}
                {/*  <FormControl fullWidth={true}>*/}
                {/*    <InputLabel id="catalog-search-key-count">*/}
                {/*      Key Count*/}
                {/*    </InputLabel>*/}
                {/*    <Select labelId="catalog-search-key-count" value={0}>*/}
                {/*      <MenuItem>100% or more</MenuItem>*/}
                {/*      <MenuItem>80%</MenuItem>*/}
                {/*      <MenuItem>60%</MenuItem>*/}
                {/*      <MenuItem value={0}>40%</MenuItem>*/}
                {/*      <MenuItem>30%</MenuItem>*/}
                {/*      <MenuItem>Macro (less than 30%)</MenuItem>*/}
                {/*    </Select>*/}
                {/*  </FormControl>*/}
                {/*</div>*/}
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
                      <MenuItem value="kailh_choc">Kailh Choc</MenuItem>
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
                    <InputLabel id="catalog-search-mcu">
                      Micro Control Unit
                    </InputLabel>
                    <Select
                      labelId="catalog-search-mcu"
                      value={getFeatureValue(ALL_MCU_TYPE)}
                      onChange={this.onChangeMcuType.bind(this)}
                    >
                      <MenuItem value="---">---</MenuItem>
                      <MenuItem value="at90usb1286">at90usb1286</MenuItem>
                      <MenuItem value="at90usb1287">at90usb1287</MenuItem>
                      <MenuItem value="at90usb646">at90usb646</MenuItem>
                      <MenuItem value="at90usb647">at90usb647</MenuItem>
                      <MenuItem value="atmega16u2">atmega16u2</MenuItem>
                      <MenuItem value="atmega16u4">atmega16u4</MenuItem>
                      <MenuItem value="atmega328p">atmega328p</MenuItem>
                      <MenuItem value="atmega32a">atmega32a</MenuItem>
                      <MenuItem value="atmega32u2">atmega32u2</MenuItem>
                      <MenuItem value="atmega32u4">atmega32u4</MenuItem>
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
              </div>
            </Grid>
            <Grid item xs={9}>
              <div className="catalog-search-result-container">
                {this.props.searchResult!.map((result) => (
                  <SearchResult
                    definition={result}
                    key={`search-result-${result.id}`}
                  />
                ))}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default CatalogSearch;

type SearchResultProps = {
  definition: IKeyboardDefinitionDocument;
};

const featureMap: { [p: string]: string } = {
  split: 'Split',
  integrated: 'Integrated',
  column_staggered: 'Column Staggered',
  row_staggered: 'Row Staggered',
  ortholinear: 'Ortholinear',
  symmetrical: 'Symmetrical',
  underglow: 'Underglow LED',
  backlight: 'Backlight LED',
  cherry_mx: 'Cherry MX',
  kailh_choc: 'Kailh Choc',
  hot_swap: 'Hotswap',
  at90usb1286: 'at90usb1286',
  at90usb1287: 'at90usb1287',
  at90usb646: 'at90usb646',
  at90usb647: 'at90usb647',
  atmega16u2: 'atmega16u2',
  atmega16u4: 'atmega16u4',
  atmega328p: 'atmega328p',
  atmega32a: 'atmega32a',
  atmega32u2: 'atmega32u2',
  atmega32u4: 'atmega32u4',
  oled: 'OLED',
  speaker: 'Speaker',
};

function SearchResult(props: SearchResultProps) {
  return (
    <Card className="catalog-search-result-card">
      <div className="catalog-search-result-card-container">
        {/*<CardMedia image={Lunakey} style={{ width: 400 }} />*/}
        <CardContent>
          <div className="catalog-search-result-card-header">
            <div className="catalog-search-result-card-header-name-container">
              <h2 className="catalog-search-result-card-name">
                {props.definition.name}
              </h2>
              <Typography variant="caption">
                {props.definition.githubDisplayName}
              </Typography>
            </div>
            <div className="catalog-search-result-card-header-link-container">
              <Button color="primary">Detail</Button>
            </div>
          </div>
          <div className="catalog-search-result-card-chip-container">
            {props.definition.features.map((feature) => (
              <Chip
                key={`feature-${props.definition.id}-${feature}`}
                size="small"
                label={featureMap[feature]}
              />
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
