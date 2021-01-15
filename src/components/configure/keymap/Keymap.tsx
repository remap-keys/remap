import React from 'react';
import './Keymap.scss';
import Keyboards from '../keyboards/Keyboards.container';
import Keydiff from '../keydiff/Keydiff.container';
import { KeymapActionsType, KeymapStateType } from './Keymap.container';

type OwnProp = {};

type KeymapPropsType = OwnProp &
  Partial<KeymapStateType> &
  Partial<KeymapActionsType>;

export default class Keymap extends React.Component<KeymapPropsType, {}> {
  constructor(props: KeymapPropsType | Readonly<KeymapPropsType>) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        {this.props.draggingKey && <div className="dragMask"></div>}
        <div className="keydiff-wrapper">
          <div className="spacer"></div>
          <Keydiff />
          <div className="spacer"></div>
        </div>
        <div className="keyboards-wrapper">
          <div className="spacer"></div>
          <Keyboards />
          <div className="balancer"></div>
          <div className="spacer"></div>
        </div>
      </React.Fragment>
    );
  }
}
