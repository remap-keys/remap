import React from 'react';
import { Link, Typography } from '@material-ui/core';
import AnchorTypography from '../../common/anchortypography/AnchorTypography';

export default function Faq() {
  return (
    <React.Fragment>
      <Typography variant="h3">Frequently Asked Questions</Typography>
      <section>
        <AnchorTypography id="faq-firmware-writing-feature" variant="h4">
          Flash Firmware feature
        </AnchorTypography>
        <AnchorTypography
          id="faq-firmware-writing-feature-why-is-not-my-device"
          variant="h5"
        >
          Q. Why is not my device listed up on the dialog at flashing a firmware
          using DFU on Windows?
        </AnchorTypography>
        <Typography variant="body1" gutterBottom={true}>
          Chrome/Edge Web browsers can treat only devices with the
          <Link
            href="https://docs.microsoft.com/en-us/windows-hardware/drivers/usbcon/winusb"
            target="_blank"
            rel="noreferrer"
          >
            WinUSB.sys
          </Link>
          USB device driver. If other device driver is applied for your target
          device, the device is not listed up on the authorization dialog or the
          &quot;Access Denied&quot; error message is shown after starting
          flashing a firmware.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          To avoid the error and flash the firmware from Remap, you need to
          apply the WinUSB.sys driver for the DFU mode of the target device.
          There are some ways to apply the driver, for example, you can apply or
          replace a USB driver using the
          <Link href="https://zadig.akeo.ie/" target="_blank" rel="noreferrer">
            Zadig
          </Link>
          application easily. Notice to do applying or replacing a device driver
          on your own risk.
        </Typography>
        <AnchorTypography
          id="faq-firmware-writing-feature-access-denied-error-message-was"
          variant="h5"
        >
          Q. &quot;Access Denied&quot; error message was shown at flashing a
          firmware using DFU on Windows.
        </AnchorTypography>
        <Typography variant="body1" gutterBottom={true}>
          See the answer of
          <Link href="#faq-firmware-writing-feature-why-is-not-my-device">
            &quot;Why is not my device listed up on the dialog at flashing a
            firmware using DFU on Windows?&quot;
          </Link>
        </Typography>
      </section>
    </React.Fragment>
  );
}
