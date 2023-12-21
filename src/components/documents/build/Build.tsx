import React from 'react';
import { Alert, Paper, Typography } from '@mui/material';
import FirmwareFileRegistrationImage from '../../../assets/images/documents/firmware-file-registration.png';
import EditFirmwareFileImage from '../../../assets/images/documents/edit-firmware-file.png';
import BuildParameterConfigurationUiImage from '../../../assets/images/documents/build-parameter-configuration-ui.png';
import BuildFirmwareButtonImage from '../../../assets/images/documents/build-firmware-button.png';
import BuildFirmwareDialogImage from '../../../assets/images/documents/build-firmware-dialog.png';
import BuildResultImage from '../../../assets/images/documents/build-result.png';

export default function Build() {
  return (
    <React.Fragment>
      <Typography variant="h3">Remap supports building a firmware</Typography>
      <section>
        <Alert severity="warning">
          [Nov 18th, 2023] This feature is currently in beta. It is possible
          that the feature is changed or removed without notice.
        </Alert>
      </section>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          Remap supports building a firmware binary file written by QMK
          Firmware. The benefits are the following:
          <ul>
            <li>
              It is unnecessary to prepare the building environment of QMK
              Firmware by users. There is the environment to build a firmware in
              the backend of the Remap and it is used at building the firmware.
              Users don&apos;t need to worry about that.
            </li>
            <li>
              Developers who provide their keyboards in Remap can register
              firmware files per keyboard so that users build the firmware
              binary file. Remap build a firmware binary file using the files.
            </li>
            <li>
              Each firmware file can have parameters to customize building the
              firmware. That is, developers can provide customization points so
              that users can build a firmware they want to customize. Users can
              customize building firmware using simple UIs to select/fill in
              each parameter.
            </li>
          </ul>
        </Typography>
        <Typography variant="h4">How to register firmware files</Typography>
        <Typography variant="body1" gutterBottom={true}>
          Keyboard developers can register firmware files at the page for
          managing the keyboard. If they have a keyboard registration which has
          already been approved by a review process, the &quot;BUILD&quot; tab
          is displayed.
        </Typography>
        <img
          src={FirmwareFileRegistrationImage}
          alt="Firmware File Registration"
        />
        <Typography variant="body1" gutterBottom={true}>
          The firmware files consist of two parts:
          <ul>
            <li>
              keyboard - Files in the `QMK_HOME/keyboards/YOUR_KEYBOARD/`
              directory (info.json, config.h, rules.mk and etc.).
            </li>
            <li>
              keymap - Files in the
              `QMK_HOME/keyboards/YOUR_KEYBOARD/keymaps/KEYMAP_NAME/` directory
              (keymap.c, rules.mk and etc.).
            </li>
          </ul>
          Each file can be registered by clicking the &quot;+&quot; icon. The
          name of the registered file is &quot;timestamp.txt&quot; by default.
          The file name and its content are displayed on the right side of the
          page after clicking the target file you want to edit.
        </Typography>
        <img src={EditFirmwareFileImage} alt="Edit Firmware File" />
        <Typography variant="body1" gutterBottom={true}>
          Edit them, then click the &quot;SAVE&quot; button to save them.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          If it is necessary to register `KEYBOARD_DIRECTORY_NAME.h` and/or
          `KEYBOARD_DIRECTORY_NAME.c` files, fill in the KEYBOARD_DIRECTORY_NAME
          to the keyboard directory name. If it is necessary to register
          `KEYBOARD_DIRECTORY_NAME.h` and/or `KEYBOARD_DIRECTORY_NAME.c` files,
          fill the KEYBOARD_DIRECTORY_NAME string in the the keyboard directory
          name. For example, if `lunakey_mini.h` and `lunakey.c` files are
          needed, fill `lunakey_mini` in the keyboard directory name field.
        </Typography>
        <Typography variant="h4">Custom parameters</Typography>
        <Typography variant="body1" gutterBottom={true}>
          Each firmware file can have custom parameters. The custom parameter is
          represented by &quot;&lt;remap /&gt;&quot; tag.
        </Typography>
        <Paper sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            gutterBottom={true}
            sx={{ mt: 2, ml: 2, fontFamily: 'monospace' }}
          >
            &lt;remap name=&quot;NAME&quot; type=&quot;TYPE&quot;
            default=&quot;DEFAULT&quot; options=&quot;OPTIONS&quot;
            comment=&quot;COMMENT&quot; /&gt;
          </Typography>
        </Paper>
        <Typography variant="body1" gutterBottom={true}>
          The &lt;remap /&gt; tag has the following attributes:
          <ul>
            <li>
              name - The name of the parameter. It is used as the key of the
              parameter.
            </li>
            <li>
              type - The type of the parameter. The following types are
              supported:
              <ul>
                <li>select - The parameter value is one of options.</li>
                <li>number - The parameter value is a number.</li>
                <li>text - The parameter value is a string.</li>
                <li>
                  toggle - The parameter value is the default value or none.
                </li>
              </ul>
            </li>
            <li>default - The default value of the parameter.</li>
            <li>
              options - The options of the parameter. It is used when the type
              is &quot;select&quot;. The options are written with the
              &apos;,&apos; character as a delimiter.
            </li>
            <li>
              comment - The comment of the parameter. This is displayed under
              each UI to describe the parameter. It is optional.
            </li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          The example is like the following:
        </Typography>
        <Paper sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            gutterBottom={true}
            sx={{ mt: 2, ml: 2, fontFamily: 'monospace' }}
          >
            VIA_ENABLE = &lt;remap name=&quot;VIA Enable&quot;
            type=&quot;select&quot; default=&quot;yes&quot;
            options=&quot;yes,no&quot; /&gt;
            <br />
            TAPPING_TERM = &lt;remap name=&quot;Tapping Term&quot;
            type=&quot;number&quot; default=&quot;130&quot; /&gt;
            <br />
            #define STARTUP_SONG SONG(&lt;remap name=&quot;Startup Song&quot;
            type=&quot;text&quot; default=&quot;M__NOTE(_C7, 30), M__NOTE(_C6,
            30)&quot; /&gt;)
            <br />
            &lt;remap name=&quot;Retro Tapping&quot; type=&quot;toggle&quot;
            default=&quot;#define RETRO_TAPPING&quot; /&gt;
          </Typography>
        </Paper>
        <Typography variant="body1" gutterBottom={true}>
          The parameters are displayed on the build page. Users can customize
          the parameters.
        </Typography>
        <img
          src={BuildParameterConfigurationUiImage}
          alt="Build Parameter Configuration UI"
        />
        <Typography variant="h4">How to build a firmware</Typography>
        <Typography variant="body1" gutterBottom={true}>
          Users can build a firmware binary file by clicking the &quot;BUILD
          FIRMWARE&quot; button on the build tag of each keyboard catalog page.
          Note that If the user is not authenticated, the button is disabled.
        </Typography>
        <img
          src={BuildFirmwareButtonImage}
          alt="Build Firmware Button on the Keyboard Catalog Page"
        />
        <Typography variant="body1" gutterBottom={true}>
          Then clicking the button, the build firmware dialog is displayed.
        </Typography>
        <img src={BuildFirmwareDialogImage} alt="Build Firmware Dialog" />
        <Typography variant="body1" gutterBottom={true}>
          After selecting the firmware file and customizing the parameters, a
          new building task is registered by clicking the &quot;BUILD&quot;
          button. The building task will be completed in a few minutes. When it
          is completed, the result is displayed on the task card.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          If the building task is succeeded, the user can download the firmware
          binary file by clicking the &quot;DOWNLOAD&quot; button. Also. the
          user can flash the firmware binary file to the MCU directly by
          clicking the &quot;FLASH&quot; button.
        </Typography>
        <img src={BuildResultImage} alt="Build Result" />
        <Typography variant="body1" gutterBottom={true}>
          If the user wants to see the logs of the building task, expand the log
          panel.
        </Typography>
      </section>
      <section>
        <Typography variant="body1" align="right">
          Written on: November 18th, 2023
        </Typography>
      </section>
    </React.Fragment>
  );
}
