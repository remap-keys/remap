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
  inputValue: string;
  label: string;
  code: string;
  selectedTabIndex: number;
};

export default class CustomKey extends React.Component<OwnProps, OwnState> {
  arrowRef: React.RefObject<unknown>;
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      value: null,
      inputValue: '',
      selectedTabIndex: 0,
      label: '',
      code: '0',
    };
    this.arrowRef = React.createRef();
  }

  private onEnter() {
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
      this.setState({ label: label, code: value.code.toString(16) });
      this.emitKeyChange({ value });
    }
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

  private setInputValue(inputValue: string) {
    this.setState({ inputValue });
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
                this.setInputValue(newInputValue.split(',')[0]);
              }}
              getOptionLabel={(option) =>
                `${option.label}, ${option.category}, ${option.subcategory}, ${
                  option.name.long
                }, ${option.name.short}, ${hexadecimal(option.code)}`
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
              defaultValue="left"
            >
              <FormControlLabel
                value="left"
                control={<Radio color="primary" />}
                label="Left"
              />
              <FormControlLabel
                value="right"
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
                control={<Checkbox color="primary" />}
                label="Shift"
              />
              <FormControlLabel
                value="control"
                control={<Checkbox color="primary" />}
                label="Ctrl"
              />
              <FormControlLabel
                value="alt"
                control={<Checkbox color="primary" />}
                label="Alt"
              />
              <FormControlLabel
                value="gui"
                control={<Checkbox color="primary" />}
                label="Win/Cmd"
              />
            </FormGroup>
          </TabPanel>
          <TabPanel value={this.state.selectedTabIndex} index={1}>
            <div className="customkey-description">
              Hold to function [Modifiers], tap to send [Keycode].
            </div>
            <TextField
              variant="outlined"
              label="Modifiers"
              className="customkey-field customkey-label"
              size="small"
            />

            <TextField
              variant="outlined"
              label="Keycode"
              className="customkey-field customkey-label"
              size="small"
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
    category: 'Basic',
    subcategory: 'Modifier',
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
