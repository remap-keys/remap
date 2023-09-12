import React from 'react';
import { Typography } from '@mui/material';

export default function SupportQmk022() {
  return (
    <React.Fragment>
      <Typography variant="h3">
        Remap supports QMK Firmware 0.22.2 or higher
      </Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          Remap team is excited that we can announce to release a new version of
          Remap which is supporting the latest QMK Firmware version.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          Since the previous announcement by us on December 2022, many keyboard
          designers needs to use the QMK Firmware version 0.18.17 or lower if
          they needs to support Remap. Because, current Remap is supporting
          keycodes of the QMK Firmware version 0.18.17 or lower and the VIA
          protocol version 0x09 only.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          We have worked hard to investigate about the keycodes and its
          structures and to improve related implementations, and finally we have
          completed all tasks to support the latest keycodes and its structures.
          The new Remap has been tested using the QMK Firmware 0.22.2. We thank
          all contributors.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          Remap users can use following two environments of Remap:
          <ul>
            <li>
              Remap for latest QMK Firmware version{' '}
              <a href="https://remap-keys.app">https://remap-keys.app</a>
            </li>
            <li>
              Remap for QMK Firmware 0.18.17 or lower
              <a href="https://qmk018.remap-keys.app">
                https://qmk018.remap-keys.app
              </a>
            </li>
          </ul>
          If your keyboard has QMK Firmware 0.22.2 or higher, you can customize
          your keyboard on the{' '}
          <a href="https://remap-keys.app">
            Remap for latest QMK Firmware version
          </a>
          . In the other hand, if your keyboard has QMK Firmware 0.18.17 or
          lower, you need to use the{' '}
          <a href="https://qmk018.remap-keys.app">
            Remap for QMK Firmware 0.18.17 or lower
          </a>{' '}
          to customize your keyboard.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          Both environments refer to the same database. Therefore, already
          registered keyboards can be used in both them, and if you register a
          new keyboard in either environment, it can be used in another it as
          well.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          Supported VIA protocol version is different on each environment.
          <ul>
            <li>
              Remap for latest QMK Firmware version: VIA protocol version 0x0B.
            </li>
            <li>
              Remap for QMK Firmware 0.18.17 or lower: VIA protocol version 0x0A
              or lower.
            </li>
          </ul>
          If you try to connect your keyboard which the VIA protocol version of
          the firmware flashed to your keyboard is not supported by the opened
          environment, it will be rejected and show the message to nagivate to
          another environment.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          Basically, Remap team will continue to provide new features to the
          &quot;Remap for latest QMK Firmware&quot; environment only. There is a
          possibility that the old environment (Remap for QMK firmware 0.18.17
          or lower) is closed after a month or later. We intend to investigate a
          situation (how rate are there keyboards which have QMK Firmware 0.22.2
          or higher and how many accesses of each environment) after a month to
          judge whether we should close it or not.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          If you find some issue, feel free to let us know that. We continue
          developing Remap to become more convenience and to make your keyboard
          life comfortable.
        </Typography>
      </section>
      <section>
        <Typography variant="body1" align="right">
          Yoichiro Tanaka (Remap team)
          <br />
          Written on: September 11th, 2023
        </Typography>
      </section>
    </React.Fragment>
  );
}
