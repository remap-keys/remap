import React from 'react';
import { Typography } from '@mui/material';

export default function Workbench() {
  return (
    <React.Fragment>
      <Typography variant="h3">
        Introducing &quot;Workbench&quot; on Remap - A Complete Firmware
        Development Environment in Your Browser!
      </Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          To make customizing your DIY keyboard even easier and more flexible,
          <br />
          <strong>Remap</strong> now offers a powerful new feature:{' '}
          <strong>Workbench</strong> — a fully browser-based environment for
          developing firmware based on QMK Firmware!
        </Typography>
        <Typography variant="h4">What is Workbench?</Typography>
        <Typography variant="body1" gutterBottom={true}>
          <strong>Workbench</strong> is an integrated development environment
          that lets you develop keyboard firmware based on QMK Firmware{' '}
          <strong>entirely within your web browser</strong>.
        </Typography>
        <Typography variant="h5">Key Features</Typography>
        <Typography variant="body1" gutterBottom={true}>
          <ul>
            <li>
              <strong>Project-Based File Management</strong>
              <br />
              Create and manage multiple projects, each containing the files
              needed for a specific keyboard.
            </li>
            <li>
              <strong>Cloud-Based Builds</strong>
              <br />
              Build firmware binaries from your source files on our cloud
              server.
            </li>
            <li>
              <strong>Write Firmware to Microcontrollers Directly</strong>
              <br />
              Flash your built firmware directly to your keyboard&apos;s
              microcontroller, right from your browser.
            </li>
            <li>
              <strong>Independent of Registered Keyboards</strong>
              <br />
              You don&apos;t need to use a keyboard registered with Remap —{' '}
              <strong>you can freely develop firmware for any keyboard.</strong>
            </li>
          </ul>
        </Typography>
        <Typography variant="h4">Launch Campaign!</Typography>
        <Typography variant="body1" gutterBottom={true}>
          You can build firmware <strong>up to 3 times for free</strong> to try
          out Workbench.
          <br />
          To celebrate the launch, we&apos;re offering a{' '}
          <strong>10-build package for just $1.65 (tax included)!</strong>
        </Typography>
        <Typography variant="h4">Getting Started</Typography>
        <Typography variant="body1" gutterBottom={true}>
          To use the Workbench feature, simply log in with one of the following
          accounts:
          <ul>
            <li>Google account</li>
            <li>GitHub account</li>
          </ul>
          Once logged in, you can access{' '}
          <strong>the Workbench feature from the Remap home screen.</strong>
        </Typography>
        <Typography variant="h4">Start Building Now</Typography>
        <Typography variant="body1" gutterBottom={true}>
          With Workbench, there&apos;s no need to set up a development
          environment — everything happens in your browser.
          <br />
          Build your own custom firmware and make your keyboard truly yours!
        </Typography>
      </section>
      <section>
        <Typography variant="body1" align="right">
          Written on: May 7th, 2025
        </Typography>
      </section>
    </React.Fragment>
  );
}
