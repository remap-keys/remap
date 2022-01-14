import React from 'react';
import './ConnectionModal.scss';
import { Backdrop, Fade, Modal } from '@mui/material';

type OnCloseHandler = () => void;

interface IConnectionProps {
  open: boolean;
  onClose: OnCloseHandler;
}

export default class ConnectionModal extends React.Component<
  IConnectionProps,
  {}
> {
  constructor(props: IConnectionProps | Readonly<IConnectionProps>) {
    super(props);
  }
  render() {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="connection-modal"
        open={this.props.open}
        onClose={this.props.onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.open}>
          <div className="paper">
            <h2>Device list</h2>
            <p>Lunakey Mini (VID: 0x5954 / PID: 0x0001)</p>
          </div>
        </Fade>
      </Modal>
    );
  }
}
