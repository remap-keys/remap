import React from 'react';
import Draggable from 'react-draggable';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  PaperProps,
  Select,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

type Props = {
  open: boolean;
  onClose: () => void;
};
type State = {
  underglowType: string;
};

const UnderglowEffects: {
  label: string;
  symbol: string;
  values?: number[];
}[] = [
  { label: 'All Off', symbol: 'all-off' },
  { label: 'Solid Color', symbol: 'RGBLIGHT_MODE_STATIC_LIGHT' },
  {
    label: 'Solid Breathing',
    symbol: 'RGBLIGHT_MODE_BREATHING',
    values: [0, 1, 2, 3],
  },
  {
    label: 'Cycling Rainbow',
    symbol: 'RGBLIGHT_MODE_RAINBOW_MOOD',
    values: [0, 1, 2],
  },
  {
    label: 'Swirling Rainbow',
    symbol: 'RGBLIGHT_MODE_RAINBOW_SWIRL',
    values: [0, 1, 2, 3, 4, 5],
  },
  {
    label: 'Snake',
    symbol: 'RGBLIGHT_MODE_SNAKE',
    values: [0, 1, 2, 3, 4, 5],
  },
  {
    label: 'Knight',
    symbol: 'RGBLIGHT_MODE_KNIGHT',
    values: [0, 1, 2],
  },
  {
    label: 'Christmas',
    symbol: 'RGBLIGHT_MODE_CHRISTMAS',
  },
  {
    label: 'Gradient',
    symbol: 'RGBLIGHT_MODE_STATIC_GRADIENT',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    label: 'Twinkle',
    symbol: 'RGBLIGHT_MODE_TWINKLE',
    values: [0, 1, 2, 3, 4, 5],
  },
  {
    label: 'RGB Test',
    symbol: 'RGBLIGHT_MODE_RGB_TEST',
  },
  {
    label: 'Alternating',
    symbol: 'RGBLIGHT_MODE_ALTERNATING',
  },
];

export default class UnderglowDialog extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      underglowType: '',
    };
  }

  private onChangeUnderglowType(name: string) {}
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={() => {}}
        onEnter={() => {}}
        PaperComponent={PaperComponent}
        className="underglow-dialog"
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          Configuration
          <div className="close-dialog">
            <CloseIcon onClick={this.props.onClose} />
          </div>
        </DialogTitle>
        <DialogContent dividers className="underglow-settings">
          <Grid container spacing={1}>
            <Grid
              item
              xs={4}
              className="underglow-label underglow-effect-type-label"
            >
              Underglow Effect Type
            </Grid>
            <Grid
              item
              xs={8}
              className="underglow-value underglow-effect-type-value"
            >
              <Select
                native
                value={this.state.underglowType}
                onChange={(e) => {
                  this.onChangeUnderglowType(e.target.value as string);
                }}
              >
                {UnderglowEffects.map((effect) => {
                  if (effect.values) {
                    return effect.values.map((v) => {
                      const value = `${effect.symbol}_${v}`;
                      return (
                        <option
                          key={value}
                          value={value}
                        >{`${effect.label}`}</option>
                      );
                    });
                  } else {
                    return (
                      <option value={effect.symbol}>{`${effect.label}`}</option>
                    );
                  }
                }).flat()}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
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
