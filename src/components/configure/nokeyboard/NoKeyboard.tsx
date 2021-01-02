import React from 'react';

export default class NoKeyboard extends React.Component {
  // TODO: SCSS and Web HID access dialog
  render() {
    return (
      <div>
        no keyboard. Please connect a QMK compatible keyboard and give this app
        permission for Web HID access
      </div>
    );
  }
}
