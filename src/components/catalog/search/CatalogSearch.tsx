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
  TextField,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
} from '@material-ui/core';
import Lunakey from './lunakey-mini.png';

const ALL_SPLIT_TYPE = ['split', 'integrated'] as const;
type splitTuple = typeof ALL_SPLIT_TYPE;
type IKeyboardSplitType = splitTuple[number];

const ALL_STAGGERED_TYPE = [
  'column_staggered',
  'row_staggered',
  'ortholinear',
  'symmetrical',
] as const;
type staggeredTuple = typeof ALL_STAGGERED_TYPE;
type IKeyboardStaggeredType = staggeredTuple[number];

const ALL_LED_TYPE = ['underglow', 'backlight'] as const;
type ledTuple = typeof ALL_LED_TYPE;
type IKeyboardLedType = ledTuple[number];

const ALL_KEY_SWITCH_TYPE = ['cherry_mx', 'kailh_choc'] as const;
type keySwitchTuple = typeof ALL_KEY_SWITCH_TYPE;
type IKeyboardKeySwitchType = keySwitchTuple[number];

const ALL_HOTSWAP_TYPE = ['hot_swap'] as const;
type hotswapTuple = typeof ALL_HOTSWAP_TYPE;
type IKeyboardHotswapType = hotswapTuple[number];

const ALL_MCU_TYPE = [
  'at90usb1286',
  'at90usb1287',
  'at90usb646',
  'at90usb647',
  'atmega16u2',
  'atmega16u4',
  'atmega328p',
  'atmega32a',
  'atmega32u2',
  'atmega32u4',
] as const;
type mcuTuple = typeof ALL_MCU_TYPE;
type IKeyboardMcuType = mcuTuple[number];

const ALL_OLED_TYPE = ['oled'] as const;
type oledTuple = typeof ALL_OLED_TYPE;
type IKeyboardOledType = oledTuple[number];

const ALL_SPEAKER_TYPE = ['speaker'] as const;
type speakerTuple = typeof ALL_SPEAKER_TYPE;
type IKeyboardSpeakerType = speakerTuple[number];

type IConditionNotSelected = '---';
const CONDITION_NOT_SELECTED: IConditionNotSelected = '---';

type IKeyboardFeatures =
  | IKeyboardSplitType
  | IKeyboardStaggeredType
  | IKeyboardLedType
  | IKeyboardKeySwitchType
  | IKeyboardHotswapType
  | IKeyboardMcuType
  | IKeyboardOledType
  | IKeyboardSpeakerType;

type CatalogSearchState = {
  splitType: IKeyboardSplitType | IConditionNotSelected;
  staggeredType: IKeyboardStaggeredType | IConditionNotSelected;
  ledType: IKeyboardLedType | IConditionNotSelected;
  keySwitchType: IKeyboardKeySwitchType | IConditionNotSelected;
  hotswapType: IKeyboardHotswapType | IConditionNotSelected;
  mcuType: IKeyboardMcuType | IConditionNotSelected;
  oledType: IKeyboardOledType | IConditionNotSelected;
  speakerType: IKeyboardSpeakerType | IConditionNotSelected;
};
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
    this.state = {
      splitType: '---',
      staggeredType: '---',
      ledType: '---',
      keySwitchType: '---',
      hotswapType: '---',
      mcuType: '---',
      oledType: '---',
      speakerType: '---',
    };
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
    this.setState({ splitType: value });
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
    this.setState({ staggeredType: value });
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
    this.setState({ ledType: value });
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
    this.setState({ keySwitchType: value });
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
    this.setState({ hotswapType: value });
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
    this.setState({ mcuType: value });
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
    this.setState({ oledType: value });
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
    this.setState({ speakerType: value });
  }

  render() {
    return (
      <div className="catalog-search-wrapper">
        <div className="catalog-search-container">
          <Grid container>
            <Grid item xs={3}>
              <div className="catalog-search-condition-container">
                <div className="catalog-search-condition">
                  <TextField
                    label="Keyword"
                    fullWidth={true}
                    value="Lunakey Mini"
                  />
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-designer">
                      Keyboard Designer
                    </InputLabel>
                    <Select labelId="catalog-search-designer" value={0}>
                      <MenuItem value={0}>Yoichiro Tanaka</MenuItem>
                      <MenuItem>Salicylic-acid3</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-key-count">
                      Key Count
                    </InputLabel>
                    <Select labelId="catalog-search-key-count" value={0}>
                      <MenuItem>100% or more</MenuItem>
                      <MenuItem>80%</MenuItem>
                      <MenuItem>60%</MenuItem>
                      <MenuItem value={0}>40%</MenuItem>
                      <MenuItem>30%</MenuItem>
                      <MenuItem>Macro (less than 30%)</MenuItem>
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
                      value={this.state.splitType}
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
                      value={this.state.staggeredType}
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
                      value={this.state.ledType}
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
                      value={this.state.keySwitchType}
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
                      value={this.state.hotswapType}
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
                      value={this.state.mcuType}
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
                      value={this.state.oledType}
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
                      value={this.state.speakerType}
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
                <Card className="catalog-search-result-card">
                  <div className="catalog-search-result-card-container">
                    <CardMedia image={Lunakey} style={{ width: 400 }} />
                    <CardContent>
                      <h2 className="catalog-search-result-card-name">
                        Lunakey Mini
                      </h2>
                      <Typography variant="caption">Yoichiro Tanaka</Typography>
                      <div className="catalog-search-result-card-chip-container">
                        <Chip size="small" label="40%" />
                        <Chip size="small" label="Split" />
                        <Chip size="small" label="Column Staggered" />
                        <Chip size="small" label="Underglow" />
                        <Chip size="small" label="Cherry MX" />
                        <Chip size="small" label="Kailh Choc" />
                        <Chip size="small" label="How Swap" />
                        <Chip size="small" label="atmega32u4" />
                        <Chip size="small" label="OLED" />
                        <Chip size="small" label="Speaker" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
                <Card className="catalog-search-result-card">
                  <div className="catalog-search-result-card-container">
                    <CardMedia image={Lunakey} style={{ width: 400 }} />
                    <CardContent>
                      <h2 className="catalog-search-result-card-name">
                        Lunakey Mini
                      </h2>
                      <Typography variant="caption">Yoichiro Tanaka</Typography>
                      <div className="catalog-search-result-card-chip-container">
                        <Chip size="small" label="40%" />
                        <Chip size="small" label="Split" />
                        <Chip size="small" label="Column Staggered" />
                        <Chip size="small" label="Underglow" />
                        <Chip size="small" label="Cherry MX" />
                        <Chip size="small" label="Kailh Choc" />
                        <Chip size="small" label="How Swap" />
                        <Chip size="small" label="atmega32u4" />
                        <Chip size="small" label="OLED" />
                        <Chip size="small" label="Speaker" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
                <Card className="catalog-search-result-card">
                  <div className="catalog-search-result-card-container">
                    <CardMedia image={Lunakey} style={{ width: 400 }} />
                    <CardContent>
                      <h2 className="catalog-search-result-card-name">
                        Lunakey Mini
                      </h2>
                      <Typography variant="caption">Yoichiro Tanaka</Typography>
                      <div className="catalog-search-result-card-chip-container">
                        <Chip size="small" label="40%" />
                        <Chip size="small" label="Split" />
                        <Chip size="small" label="Column Staggered" />
                        <Chip size="small" label="Underglow" />
                        <Chip size="small" label="Cherry MX" />
                        <Chip size="small" label="Kailh Choc" />
                        <Chip size="small" label="How Swap" />
                        <Chip size="small" label="atmega32u4" />
                        <Chip size="small" label="OLED" />
                        <Chip size="small" label="Speaker" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default CatalogSearch;
