import React from 'react';
import './LayoutOptionsDialog.scss';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Switch,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  LayoutOptionsDialogActionsType,
  LayoutOptionsDialogStateType,
} from './LayoutOptionsDialog.container';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

type OwnProps = {
  open: boolean;
  onClose: () => void;
};

type LayoutOptionsDialogProps = OwnProps &
  Partial<LayoutOptionsDialogActionsType> &
  Partial<LayoutOptionsDialogStateType>;

type OwnState = {};

export default class LayoutOptionsDialog extends React.Component<
  LayoutOptionsDialogProps,
  OwnState
> {
  constructor(
    props: LayoutOptionsDialogProps | Readonly<LayoutOptionsDialogProps>
  ) {
    super(props);
    this.state = {};
  }
  render() {
    const labels = this.props.keyboardLayoutOptions!;
    const selectedLayoutOptions = this.props.selectedKeyboardOptions!;
    return (
      <Dialog
        open={this.props.open}
        onClose={() => {}}
        onEnter={() => {}}
        PaperComponent={PaperComponent}
        className="layout-options-dialog"
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          Layout Options
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="layout-options">
          <Grid container spacing={1}>
            {labels.map((options, index) => {
              return (
                <OptionRowComponent
                  key={index}
                  options={options}
                  selectedOption={selectedLayoutOptions[index]}
                  onChange={(choice: string | null) => {
                    this.props.setLayoutOption!(index, choice);
                  }}
                />
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

type OptionRowType = {
  options: string | string[];
  selectedOption: string | null;
  onChange: (value: string | null) => void;
};
function OptionRowComponent(props: OptionRowType) {
  if (typeof props.options == 'string') {
    const option: string = props.options;
    return (
      <React.Fragment>
        <Grid item xs={6} className="option-label">
          {props.options}
        </Grid>
        <Grid item xs={6} className="option-value">
          <Switch
            checked={!!props.selectedOption}
            onChange={(e) => {
              props.onChange(e.target.checked ? option : null);
            }}
            color="primary"
            name="checkedB"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Grid>
      </React.Fragment>
    );
  }

  const label = props.options[0];
  const choices: string[] = props.options.slice(1);
  return (
    <React.Fragment>
      <Grid item xs={6} className="option-label">
        {props.options[0]}
      </Grid>
      <Grid item xs={6} className="option-value">
        <Select
          value={props.selectedOption}
          onChange={(e) => {
            props.onChange(e.target.value as string);
          }}
          className="option-value-select"
        >
          {choices.map((choice, index) => {
            return (
              <MenuItem key={`${label}${index}`} value={choice}>
                {choice}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
    </React.Fragment>
  );
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
