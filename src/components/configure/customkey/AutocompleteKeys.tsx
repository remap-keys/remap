import React from 'react';
import './AutocompleteKeys.scss';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { KeycodeOption } from './CustomKey';

type OwnProps = {
  keycodeOptions: KeycodeOption[];
  keycodeInfo: KeycodeOption | null;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (keycodeInfo: KeycodeOption | null) => void;
};

type OwnState = {
  value: KeycodeOption | null;
  inputValue: string;
};

export default class AutocompleteKeys extends React.Component<
  OwnProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      value: this.props.keycodeInfo,
      inputValue: '',
    };
  }

  private updateValue(value: KeycodeOption | null) {
    this.setState({ value });
    this.props.onChange(value);
  }

  private setInputValue(inputValue: string) {
    this.setState({ inputValue });
  }
  render() {
    return (
      <Autocomplete
        className={this.props.className || undefined}
        autoHighlight
        freeSolo
        size="small"
        options={this.props.keycodeOptions as KeycodeOption[]}
        value={this.state.value}
        onChange={(event: any, newValue: string | KeycodeOption | null) => {
          this.updateValue(newValue as KeycodeOption);
        }}
        inputValue={this.state.inputValue}
        onInputChange={(event, newInputValue) => {
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
