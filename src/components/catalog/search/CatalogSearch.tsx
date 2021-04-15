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

type IKeyboardSplitType = 'split' | 'integrated';
type IKeyboardStaggeredType =
  | 'column_staggered'
  | 'row_staggered'
  | 'ortholinear'
  | 'symmetrical';
type IKeyboardLedType = 'underglow' | 'backlight';
type IKeyboardKeySwitchType = 'cherry_mx' | 'kailh_choc';
type IKeyboardHotswapType = 'hot_swap';
type IKeyboardMcuType =
  | 'at90usb1286'
  | 'at90usb1287'
  | 'at90usb646'
  | 'at90usb647'
  | 'atmega16u2'
  | 'atmega16u4'
  | 'atmega328p'
  | 'atmega32a'
  | 'atmega32u2'
  | 'atmega32u4';
type IKeyboardOledType = 'oled';
type IKeyboardSpeakerType = 'speaker';
type IKeyboardFeatures =
  | IKeyboardSplitType
  | IKeyboardStaggeredType
  | IKeyboardLedType
  | IKeyboardKeySwitchType
  | IKeyboardHotswapType
  | IKeyboardMcuType
  | IKeyboardOledType
  | IKeyboardSpeakerType;

type CatalogSearchState = {};
type OwnProps = {};
type CatalogSearchProps = OwnProps &
  Partial<CatalogSearchActionsType> &
  Partial<CatalogSearchStateType>;

export default class CatalogSearch extends React.Component<
  CatalogSearchProps,
  CatalogSearchState
> {
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
                    <Select labelId="catalog-search-split" value={0}>
                      <MenuItem>Integrated</MenuItem>
                      <MenuItem value={0}>Split</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-staggered">
                      Staggered
                    </InputLabel>
                    <Select labelId="catalog-search-staggered" value={0}>
                      <MenuItem>Row Staggered</MenuItem>
                      <MenuItem value={0}>Column Staggered</MenuItem>
                      <MenuItem>Ortholinear</MenuItem>
                      <MenuItem>Symmetrical</MenuItem>
                      <MenuItem>Other</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-lighting">
                      Lighting
                    </InputLabel>
                    <Select labelId="catalog-search-lighting" value={0}>
                      <MenuItem>Backlight</MenuItem>
                      <MenuItem value={0}>Underglow</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-key-switch">
                      Key Switch
                    </InputLabel>
                    <Select labelId="catalog-search-key-switch" value={0}>
                      <MenuItem value={0}>Cherry MX Compatible</MenuItem>
                      <MenuItem>Kailh Choc</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-hot-swap">
                      Hot Swap
                    </InputLabel>
                    <Select labelId="catalog-search-hot-swap" value={0}>
                      <MenuItem value={0}>Supported</MenuItem>
                      <MenuItem>Not Supported</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-mcu">
                      Micro Control Unit
                    </InputLabel>
                    <Select labelId="catalog-search-mcu" value={0}>
                      <MenuItem>at90usb1286</MenuItem>
                      <MenuItem>at90usb1287</MenuItem>
                      <MenuItem>at90usb646</MenuItem>
                      <MenuItem>at90usb647</MenuItem>
                      <MenuItem>atmega16u2</MenuItem>
                      <MenuItem>atmega16u4</MenuItem>
                      <MenuItem>atmega328p</MenuItem>
                      <MenuItem>atmega32a</MenuItem>
                      <MenuItem>atmega32u2</MenuItem>
                      <MenuItem value={0}>atmega32u4</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-oled">OLED</InputLabel>
                    <Select labelId="catalog-search-oled" value={0}>
                      <MenuItem value={0}>Supported</MenuItem>
                      <MenuItem>Not Supported</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="catalog-search-condition">
                  <FormControl fullWidth={true}>
                    <InputLabel id="catalog-search-speaker">Speaker</InputLabel>
                    <Select labelId="catalog-search-speaker" value={0}>
                      <MenuItem value={0}>Supported</MenuItem>
                      <MenuItem>Not Supported</MenuItem>
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
