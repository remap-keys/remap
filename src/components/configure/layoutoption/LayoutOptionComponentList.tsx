import React from 'react';
import {
  LayoutOptionComponentListActionsType,
  LayoutOptionComponentListStateType,
} from './LayoutOptionComponentList.container';
import { Grid, MenuItem, Select, Switch } from '@mui/material';
import './LayoutOptionComponentList.scss';
import { t } from 'i18next';

type OwnProps = {
  hidSupport: boolean;
};

type LayoutOptionComponentListProps = OwnProps &
  Partial<LayoutOptionComponentListActionsType> &
  Partial<LayoutOptionComponentListStateType>;

type OwnState = {};

export default class LayoutOptionComponentList extends React.Component<
  LayoutOptionComponentListProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {};
  }

  private getSelectedOptionChoice(option: number): number {
    const layoutOption = this.props.selectedLayoutOptions!.find((options) => {
      return options.option === option;
    });

    return layoutOption ? layoutOption.optionChoice : 0;
  }

  render() {
    const labels = this.props.keyboardLayoutOptions!;
    if (labels && labels.length > 0) {
      return (
        <Grid
          container
          spacing={1}
          className="layout-option-component-list-content"
        >
          {labels.map((options, index) => {
            if (typeof options == 'string') {
              return (
                <OptionRowSwitchComponent
                  key={`layout-option-row${index}`}
                  optionLabel={options}
                  selectedOptionChoice={this.getSelectedOptionChoice(index)}
                  onChange={(choice: number) => {
                    this.props.setLayoutOption!(
                      index,
                      choice,
                      this.props.hidSupport
                    );
                  }}
                />
              );
            } else {
              return (
                <OptionRowSelectComponent
                  key={`layout-option-row${index}`}
                  optionLabels={options}
                  selectedOptionChoice={this.getSelectedOptionChoice(index)}
                  onChange={(choice: number) => {
                    this.props.setLayoutOption!(
                      index,
                      choice,
                      this.props.hidSupport
                    );
                  }}
                />
              );
            }
          })}
        </Grid>
      );
    } else {
      return <div>{t('There is no Layout Option.')}</div>;
    }
  }
}

type OptionRowSwitchType = {
  optionLabel: string;
  selectedOptionChoice: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (optionChoice: number) => void;
};
function OptionRowSwitchComponent(props: OptionRowSwitchType) {
  return (
    <React.Fragment>
      <Grid item xs={8} className="layout-option-component-list-option-label">
        {props.optionLabel}
      </Grid>
      <Grid item xs={4} className="layout-option-component-list-option-value">
        <Switch
          checked={props.selectedOptionChoice === 1}
          onChange={(e) => {
            props.onChange(e.target.checked ? 1 : 0);
          }}
          color="primary"
          name="checkedB"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </Grid>
    </React.Fragment>
  );
}

type OptionRowSelectType = {
  optionLabels: string[];
  selectedOptionChoice: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (optionChoice: number) => void;
};
function OptionRowSelectComponent(props: OptionRowSelectType) {
  const label = props.optionLabels[0];
  const choices: string[] = props.optionLabels.slice(1);
  return (
    <React.Fragment>
      <Grid item xs={8} className="layout-option-component-list-option-label">
        {label}
      </Grid>
      <Grid item xs={4} className="layout-option-component-list-option-value">
        <Select
          value={props.selectedOptionChoice}
          onChange={(e) => {
            props.onChange(Number(e.target.value));
          }}
          className="layout-option-component-list-option-value-select"
        >
          {choices.map((choice, index) => {
            return (
              <MenuItem key={`${label}${index}`} value={index}>
                {choice}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
    </React.Fragment>
  );
}
