import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { KeycodeOption } from './CustomKey';
import { Key } from '../keycodekey/KeycodeKey.container';

type OwnProps = {
  keycodeOptions: KeycodeOption[];
  key: Key;
  // eslint-disable-next-line no-unused-vars
  onChange: (key: Key) => void;
};

type OwnState = {
  value: KeycodeOption | null;
  inputValue: string;
  label: string;
  code: number;
};

export default class AutocompleteKeycode extends React.Component<
  OwnProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    //TODO: initialize input status
    const value: KeycodeOption = {
      category: 'Basic',
      subcategory: '',
      ...this.props.key.keymap.keycodeInfo!,
    };
    this.state = {
      value: value,
      inputValue: '',
      label: value.label,
      code: value.code, // includes Modifiers (0xFFFF)
    };
  }

  private emitKeyChange(args: {
    value?: KeycodeOption;
    label?: string;
    code?: string;
  }) {
    let label = args.label == undefined ? this.state.label : args.label;
    let code =
      args.code == undefined ? this.state.code : parseInt(args.code, 16);
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

  private getFullCode(args: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    gui?: boolean;
    keycode?: number;
    rl?: number;
  }): number {
    return 0;
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

  private setInputValue(inputValue: string) {
    this.setState({ inputValue });
  }
  render() {
    return (
      <Autocomplete
        className="customkey-field"
        autoHighlight
        freeSolo
        size="small"
        options={this.props.keycodeOptions as KeycodeOption[]}
        value={this.state.value}
        onChange={(event: any, newValue: string | KeycodeOption | null) => {
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
            {option.desc && <div className="keycode-desc">{option.desc}</div>}
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
    );
  }
}
