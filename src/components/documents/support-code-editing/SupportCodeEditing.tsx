import React from 'react';
import { Alert, Typography } from '@mui/material';
import CodeEditingForBuildingFirmwareImage from '../../../assets/images/documents/code-editing-for-building-firmware.png';
import BuiltCodeImage from '../../../assets/images/documents/built-code.png';
import TurnOffCodeEditingFeatureImage from '../../../assets/images/documents/turn-off-code-editing-feature.png';

export default function SupportCodeEditing() {
  return (
    <React.Fragment>
      <Typography variant="h3">
        Remap supports a code editing for building a firmware
      </Typography>
      <section>
        <Alert severity="warning">
          [Nov 30th, 2023] This feature is currently in beta. It is possible
          that the feature is changed or removed without notice.
        </Alert>
      </section>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          Remap supports a code editing for building a firmware. Users can edit
          files of registered keyboard firmware directly before building it.
        </Typography>
        <img
          src={CodeEditingForBuildingFirmwareImage}
          alt="Code Editing for Building Firmware"
        />
        <Typography variant="body1" gutterBottom={true}>
          All features provided by QMK Firmware are available by using the
          Firmware Code Editing feature. Remap cannot still provide many
          features: using Combos, Key Overrides, customizing Tap Dance and so
          on. But, users can get them by editing a code.
        </Typography>
        <img src={BuiltCodeImage} alt="Built Code" />
        <Typography variant="body1" gutterBottom={true}>
          If a keyboard designer does not want to edit codes by users, the code
          editing feature can be turned off.
        </Typography>
        <img
          src={TurnOffCodeEditingFeatureImage}
          alt="Turn off code editing feature"
        />
        <Typography variant="body1" gutterBottom={true}>
          This feature brings users to customize a firmware more easily and
          deeply without preparing a development environment locally. In other
          words, Remap becomes an IDE to build a firmware.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          We expect that many users can customize their keyboard more easily and
          deeply with this feature.
        </Typography>
      </section>
      <section>
        <Typography variant="body1" align="right">
          Written on: November 30th, 2023
        </Typography>
      </section>
    </React.Fragment>
  );
}
