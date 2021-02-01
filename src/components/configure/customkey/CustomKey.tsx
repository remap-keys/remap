/* eslint-disable no-undef */
import React from 'react';
import './CustomKey.scss';
import Popover from '@material-ui/core/Popover';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  AppBar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import { hexadecimal } from '../../../utils/StringUtils';
import { Key } from '../keycodekey/KeycodeKey.container';

type OwnProps = {
  id: string;
  value: Key;
  open: boolean;
  anchorRef: React.RefObject<any> | null;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (newKey: Key) => void;
};

type OwnState = {
  value: KeycodeOption | null;
  value2: KeycodeOption | null;
  valueMT: KeycodeOption | null;
  inputValue: string;
  inputValue2: string;
  inputValueMT: string;
  label: string;
  code: string;
  rl: number; // 0:left, 1:right
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  gui: boolean;
  selectedTabIndex: number;
};

export default class CustomKey extends React.Component<OwnProps, OwnState> {
  arrowRef: React.RefObject<unknown>;
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      value: null,
      value2: null,
      valueMT: null,
      inputValue: '',
      inputValue2: '',
      inputValueMT: '',
      selectedTabIndex: 0,
      label: '',
      code: '0',
      rl: 0,
      shift: false,
      ctrl: false,
      alt: false,
      gui: false,
    };
    this.arrowRef = React.createRef();
  }

  private onEnter() {
    //TODO: initialize input status
    const value: KeycodeOption = {
      category: 'Basic',
      subcategory: '',
      ...this.props.value.keymap.keycodeInfo!,
    };
    this.setState({
      value: value,
      label: value.label,
      code: value.code.toString(16),
    });
  }

  private emitKeyChange(args: {
    value?: KeycodeOption;
    label?: string;
    code?: string;
  }) {
    let label = args.label == undefined ? this.state.label : args.label;
    let code =
      args.code == undefined
        ? parseInt(this.state.code, 16)
        : parseInt(args.code, 16);
    let value = this.state.value!;
    if (args.value) {
      label = args.value.label;
      code = args.value.code;
      value = args.value;
    }

    const key: Key = {
      label: label,
      meta: '',
      keymap: {
        isAny: false,
        code: code,
        keycodeInfo: { ...value, ...{ label: label, code: code } },
      },
    };
    console.log(key);
    this.props.onChange(key);
  }

  private updateValue(value: KeycodeOption | null) {
    this.setState({ value });
    if (value) {
      const label = value.label;
      const code = this.getFullCode({ keycode: value.code });
      this.setState({ label: label, code: code });
      this.emitKeyChange({ value });
    }
  }

  private updateValue2(value2: KeycodeOption | null) {
    this.setState({ value2 });
  }

  private updateValueMT(valueMT: KeycodeOption | null) {
    this.setState({ valueMT });
  }

  private updateLabel(label: string) {
    this.setState({ label });
    console.log(label);
    this.emitKeyChange({ label });
  }

  private updateCode(code: string) {
    if (this.state.code != code) {
      this.setState({ code });
      this.emitKeyChange({ code });
    }
  }

  private getFullCode(args: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    gui?: boolean;
    keycode?: number;
    rl?: number;
  }): string {
    let mod = 0b0000;
    if (args.ctrl || (args.ctrl == undefined && this.state.ctrl)) {
      mod |= 0b0001;
    }

    if (args.shift || (args.shift == undefined && this.state.shift)) {
      mod |= 0b0010;
    }

    if (args.alt || (args.alt == undefined && this.state.alt)) {
      mod |= 0b0100;
    }

    if (args.gui || (args.gui == undefined && this.state.gui)) {
      mod |= 0b1000;
    }

    if (0 < mod) {
      if (args.rl == undefined) {
        if (this.state.rl == 1) {
          mod |= 0b1_0000;
        } else {
          mod |= 0b0_0000;
        }
      } else {
        if (args.rl == 1) {
          console.log('right');
          mod |= 0b1_0000;
        } else {
          console.log('left');
          mod |= 0b0_0000;
        }
      }
    }
    let codeNum =
      args.keycode == undefined ? this.state.value!.code : args.keycode;
    console.log(`codeNum: ${codeNum}`);
    console.log(`mode: ${mod << 8}`);
    if (codeNum <= 0xff) {
      codeNum = (mod << 8) | codeNum;
    }
    const code = Number(codeNum).toString(16).toUpperCase();
    return code;
  }

  private updateCtrl(ctrl: boolean) {
    const code = this.getFullCode({ ctrl });
    console.log(code);
    this.updateCode(code);
    this.setState({ ctrl });
  }

  private updateShift(shift: boolean) {
    const code = this.getFullCode({ shift });
    this.updateCode(code);
    this.setState({ shift });
  }

  private updateAlt(alt: boolean) {
    const code = this.getFullCode({ alt });
    this.updateCode(code);
    this.setState({ alt });
  }

  private updateGui(gui: boolean) {
    const code = this.getFullCode({ gui });
    this.updateCode(code);
    this.setState({ gui });
  }

  private updateRL(_rl: string) {
    const rl = parseInt(_rl);
    const code = this.getFullCode({ rl });
    this.updateCode(code);
    this.setState({ rl });
  }

  private setInputValue(inputValue: string) {
    this.setState({ inputValue });
  }

  private setInputValue2(inputValue2: string) {
    this.setState({ inputValue2 });
  }

  private setInputValueMT(inputValueMT: string) {
    this.setState({ inputValueMT });
  }

  private selectTab(event: React.ChangeEvent<{}>, selectedTabIndex: number) {
    this.setState({ selectedTabIndex });
  }

  render() {
    if (this.props.anchorRef?.current == null) {
      return <div></div>;
    }
    return (
      <Popover
        id={this.props.id}
        open={this.props.open}
        anchorEl={this.props.anchorRef.current}
        onEnter={this.onEnter.bind(this)}
        onClose={() => {
          console.log('Popover.onClose');
          this.props.onClose();
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        className="customkey-popover"
      >
        <div className="customkey-body">
          <AppBar position="static" color="transparent" elevation={0}>
            <Tabs
              value={this.state.selectedTabIndex}
              onChange={(e, v) => {
                this.selectTab(e, v);
              }}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="KEYS" {...a11yProps(0)} />
              <Tab label="2 FUNCS" {...a11yProps(1)} />
              <Tab label="CUSTOM" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.selectedTabIndex} index={0}>
            <Autocomplete
              id="customkey-autocomplete"
              className="customkey-field"
              autoHighlight
              freeSolo
              size="small"
              options={keycodeOptions as KeycodeOption[]}
              value={this.state.value}
              onChange={(
                event: any,
                newValue: string | KeycodeOption | null
              ) => {
                console.log('onChange');
                console.log(newValue);
                this.updateValue(newValue as KeycodeOption);
              }}
              inputValue={this.state.inputValue}
              onInputChange={(event, newInputValue) => {
                console.log('onInputChange');
                console.log(newInputValue);
                this.setInputValue(newInputValue.split('::')[0]);
              }}
              getOptionLabel={(option) =>
                `${option.label}::${option.category}::${option.subcategory}`
              }
              renderOption={(option) => (
                <div className="customkey-select-item">
                  <div className="keycode-label-wrapper">
                    <div className="keycode-label">{option.label}</div>
                    <div className="keycode-category">
                      {option.category}
                      {option.subcategory && ` / ${option.subcategory}`}
                    </div>
                  </div>
                  {option.desc && (
                    <div className="keycode-desc">{option.desc}</div>
                  )}
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Keycode"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
            <div className="modifiers-label">Modifiers</div>
            <RadioGroup
              row
              aria-label="position"
              name="left-right"
              defaultValue={'0'}
              value={'' + this.state.rl}
              onChange={(e) => {
                this.updateRL(e.target.value);
              }}
            >
              <FormControlLabel
                value="0"
                control={<Radio color="primary" />}
                label="Left"
              />
              <FormControlLabel
                value="1"
                control={<Radio color="primary" />}
                label="Right"
              />
            </RadioGroup>
            <FormGroup
              aria-label="position"
              row
              style={{ justifyContent: 'space-between' }}
            >
              <FormControlLabel
                value="shift"
                control={
                  <Checkbox
                    color="primary"
                    onChange={(e) => {
                      this.updateShift(e.target.checked);
                    }}
                    checked={this.state.shift}
                  />
                }
                label="Shift"
              />
              <FormControlLabel
                value="control"
                control={
                  <Checkbox
                    color="primary"
                    onChange={(e) => {
                      this.updateCtrl(e.target.checked);
                    }}
                    checked={this.state.ctrl}
                  />
                }
                label="Ctrl"
              />
              <FormControlLabel
                value="alt"
                control={
                  <Checkbox
                    color="primary"
                    onChange={(e) => {
                      this.updateAlt(e.target.checked);
                    }}
                    checked={this.state.alt}
                  />
                }
                label="Alt"
              />
              <FormControlLabel
                value="gui"
                control={
                  <Checkbox
                    color="primary"
                    onChange={(e) => {
                      this.updateGui(e.target.checked);
                    }}
                    checked={this.state.gui}
                  />
                }
                label="Win/Cmd"
              />
            </FormGroup>
          </TabPanel>
          <TabPanel value={this.state.selectedTabIndex} index={1}>
            <div className="customkey-description">
              Hold to function [Modifiers], tap to send [Keycode].
            </div>
            <Autocomplete
              id="customkey-autocomplete"
              className="customkey-field"
              autoHighlight
              freeSolo
              size="small"
              options={dualFunctionalKeycodeOptions as KeycodeOption[]}
              value={this.state.value2}
              onChange={(
                event: any,
                newValue: string | KeycodeOption | null
              ) => {
                this.updateValueMT(newValue as KeycodeOption);
              }}
              inputValue={this.state.inputValue2}
              onInputChange={(event, newInputValue) => {
                this.setInputValueMT(newInputValue.split('::')[0]);
              }}
              getOptionLabel={(option) =>
                `${option.label}::${option.category}::${option.subcategory}`
              }
              renderOption={(option) => (
                <div className="customkey-select-item">
                  <div className="keycode-label-wrapper">
                    <div className="keycode-label">{option.label}</div>
                    <div className="keycode-category">
                      {option.category}
                      {option.subcategory && ` / ${option.subcategory}`}
                    </div>
                  </div>
                  {option.desc && (
                    <div className="keycode-desc">{option.desc}</div>
                  )}
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Hold to function modifiers"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
            <Autocomplete
              id="customkey-autocomplete"
              className="customkey-field"
              autoHighlight
              freeSolo
              size="small"
              options={
                keycodeOptions.filter(
                  (op) => op.category == 'Basic'
                ) as KeycodeOption[]
              }
              value={this.state.value2}
              onChange={(
                event: any,
                newValue: string | KeycodeOption | null
              ) => {
                console.log('onChange2');
                console.log(newValue);
                this.updateValue2(newValue as KeycodeOption);
              }}
              inputValue={this.state.inputValue2}
              onInputChange={(event, newInputValue) => {
                console.log('onInputChange2');
                console.log(newInputValue);
                this.setInputValue2(newInputValue.split('::')[0]);
              }}
              getOptionLabel={(option) =>
                `${option.label}::${option.category}::${option.subcategory}`
              }
              renderOption={(option) => (
                <div className="customkey-select-item">
                  <div className="keycode-label-wrapper">
                    <div className="keycode-label">{option.label}</div>
                    <div className="keycode-category">
                      {option.category}
                      {option.subcategory && ` / ${option.subcategory}`}
                    </div>
                  </div>
                  {option.desc && (
                    <div className="keycode-desc">{option.desc}</div>
                  )}
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tap to send keycode"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          </TabPanel>
          <TabPanel value={this.state.selectedTabIndex} index={2}>
            <div className="customkey-description">
              You can assign a keycode(hex) directly.
            </div>
            <TextField
              variant="outlined"
              label="Label"
              className="customkey-field customkey-label"
              size="small"
              onChange={(e) => {
                this.updateLabel(e.target.value);
              }}
              value={this.state.label}
            />

            <TextField
              variant="outlined"
              label="Code(hex)"
              className="customkey-field customkey-label customkey-code"
              size="small"
              onChange={(e) => {
                const code = e.target.value
                  .toUpperCase()
                  .replace(/[^0-9,A-F]/g, '')
                  .slice(0, 4);
                this.updateCode(code);
              }}
              value={this.state.code}
            />
            <div className="customkey-bcode">
              {('0000000000000000' + parseInt(this.state.code, 16).toString(2))
                .slice(-16)
                .replace(/([0-1]{4}?)/g, '$1 ')}
            </div>
          </TabPanel>
        </div>
      </Popover>
    );
  }
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export type KeycodeOption = {
  code: number;
  label: string;
  name: {
    long: string;
    short: string;
  };
  category: string;
  subcategory: string;
  desc?: string;
};

const keycodeOptions: KeycodeOption[] = [
  {
    code: 1,
    name: {
      long: 'KC_TRANSPARENT',
      short: 'KC_TRNS',
    },
    label: '▽',
    category: 'Basic',
    subcategory: '',
  },
  {
    code: 4,
    name: { long: 'KC_A', short: 'KC_A' },
    label: 'A',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 5,
    name: { long: 'KC_B', short: 'KC_B' },
    label: 'B',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 6,
    name: { long: 'KC_C', short: 'KC_C' },
    label: 'C',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 7,
    name: { long: 'KC_D', short: 'KC_D' },
    label: 'D',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 8,
    name: { long: 'KC_E', short: 'KC_E' },
    label: 'E',
    category: 'Basic',
    subcategory: 'Letter',
  },
  {
    code: 39,
    name: { long: 'KC_0', short: 'KC_0' },
    label: '0',
    category: 'Basic',
    subcategory: 'Digit',
  },
  {
    code: 225,
    name: { long: 'KC_LSHIFT', short: 'KC_LSFT' },
    label: 'Left Shift',
    category: 'Modifier',
    subcategory: '',
  },
  {
    code: 135,
    name: { long: 'KC_INT1', short: 'KC_RO' },
    label: 'Ro',
    category: 'Special',
    subcategory: 'INT',
  },
  {
    code: 23552,
    name: { long: 'RESET', short: 'RESET' },
    label: 'Reset',
    category: 'Special',
    subcategory: 'Firmware',
    desc: 'Resets the keyboard back to the bootloader, to flash new firmware.',
  },
];

const dualFunctionalKeycodeOptions: KeycodeOption[] = [
  {
    code: 0b0110_0001,
    name: { long: 'MT(CTRL|kc)', short: 'MT(CTRL|kc)' },
    label: 'Ctrl',
    category: '2 Functions',
    subcategory: '',
    desc: '',
  },
  {
    code: 0b0110_0010,
    name: { long: 'MT(SHIFT|kc)', short: 'MT(SHIFT|kc)' },
    label: 'Shift',
    category: '2 Functions',
    subcategory: '',
    desc: '',
  },
  {
    code: 0b0110_0100,
    name: { long: 'MT(ALT|kc)', short: 'MT(ALT|kc)' },
    label: 'Alt',
    category: '2 Functions',
    subcategory: '',
    desc: '',
  },
  {
    code: 0b0110_1000,
    name: { long: 'MT(GUI|kc)', short: 'MT(GUI|kc)' },
    label: 'Win/Cmd',
    category: '2 Functions',
    subcategory: '',
    desc: '',
  },
];
