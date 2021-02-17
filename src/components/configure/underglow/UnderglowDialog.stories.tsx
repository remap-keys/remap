import { Button } from '@material-ui/core';
import React from 'react';
import UnderglowDialog from './UnderglowDialog';
export default {
  title: 'UnderglowDialog',
};

type State = {
  open: boolean;
};

class Story extends React.Component<{}, State> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      open: false,
    };
  }
  render() {
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            this.setState({ open: true });
          }}
        >
          Open
        </Button>
        <UnderglowDialog
          open={this.state.open}
          underglowColor={{ h: 200, s: 100, v: 100 }}
          onClose={() => {
            this.setState({ open: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export const Default = () => <Story />;
