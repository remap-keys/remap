import React from 'react';
import { Typography } from '@mui/material';

export default function Encoders() {
  return (
    <React.Fragment>
      <Typography variant="h3">Remap supports Rotary Encoders</Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          Remap team is excited that we can announce to release a new version of
          Remap which is supporting Encoders.
        </Typography>
        <Typography variant="h4">How to support Encoders</Typography>
        <Typography variant="body1" gutterBottom={true}>
          You need to do the following steps to support Encoders in the QMK
          Firmware side:
          <ol>
            <li>
              Define Encoders in the `config.h` according to the{' '}
              <a href="https://docs.qmk.fm/#/feature_encoders?id=encoders">
                document
              </a>
              .
            </li>
            <li>
              Define Encoder Map in the `keymap.c` file according to the{' '}
              <a href="https://docs.qmk.fm/#/feature_encoders?id=encoder-map">
                document
              </a>
              .
            </li>
            <li>
              Define `ENCODER_ENABLE=yes` and `ENCODER_MAP_ENABLE=yes` in the
              `rules.mk` file.
            </li>
          </ol>
          Then, you need to define encoders in the VIA JSON file as a center
          label. See: the{' '}
          <a href="https://www.caniusevia.com/docs/layouts#encoders-without-push-switch-just-twist-no-push">
            document
          </a>
          .
        </Typography>
      </section>
      <section>
        <Typography variant="body1" align="right">
          Written on: September 21th, 2023
        </Typography>
      </section>
    </React.Fragment>
  );
}
