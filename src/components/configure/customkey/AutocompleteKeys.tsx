import React from 'react';
import './AutocompleteKeys.scss';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { IKeymap } from '../../../services/hid/Hid';

type OwnProps = {
  keycodeOptions: IKeymap[];
  keycodeInfo: IKeymap | null;
  label: string;
  showKinds?: boolean;
  disabled?: boolean;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (keycodeInfo: IKeymap | null) => void;
};

type OwnState = {
  inputValue: string;
};

export default class AutocompleteKeys extends React.Component<
  OwnProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  private updateValue(value: IKeymap | string | null) {
    if (typeof value != 'string') {
      this.props.onChange(value);
    }
  }

  private setInputValue(inputValue: string) {
    this.setState({ inputValue });
  }
  render() {
    return (
      <Autocomplete
        className={this.props.className || undefined}
        disabled={this.props.disabled}
        autoHighlight
        freeSolo
        size="small"
        options={this.props.keycodeOptions}
        value={this.props.keycodeInfo}
        onChange={(event: any, newValue: string | IKeymap | null) => {
          this.updateValue(newValue as IKeymap);
        }}
        inputValue={this.state.inputValue}
        onInputChange={(event, newInputValue) => {
          this.setInputValue(newInputValue.split('::')[0]);
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          } else {
            return `${option.keycodeInfo!.label}::${option.kinds.join('::')}`;
          }
        }}
        renderOption={(option) => (
          <div className="customkey-auto-select-item">
            <div className="keycode-auto-label-wrapper">
              <div className="keycode-auto-label">
                {option.keycodeInfo!.label}
              </div>
              {this.props.showKinds != false && (
                <div className="keycode-auto-category">
                  {option.kinds
                    .map((k) => {
                      return k
                        .split('_')
                        .map(
                          (text) => text.charAt(0).toUpperCase() + text.slice(1)
                        )
                        .flat()
                        .join('-');
                    })
                    .join('/')}
                </div>
              )}
            </div>
            {option.desc && (
              <div className="keycode-auto-desc">{option.desc}</div>
            )}
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={this.props.label}
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
