import React from 'react';
import { Typography } from '@mui/material';

export default function TypingPractice() {
  return (
    <React.Fragment>
      <Typography variant="h3">
        Introducing &quot;Typing Practice&quot; on Remap - Master Your Custom
        Keymap!
      </Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          To help you get the most out of your customized keyboard,
          <br />
          <strong>Remap</strong> now features a built-in{' '}
          <strong>Typing Practice</strong> module!
        </Typography>
        <Typography variant="h4">Why Typing Practice?</Typography>
        <Typography variant="body1" gutterBottom={true}>
          Changing your keyboard layout can be exciting, but it often takes time
          to build muscle memory. Our <strong>Typing Practice</strong> feature
          is designed to help you master your new keymap quickly and
          efficiently, all within your browser.
        </Typography>
        <Typography variant="h5">Key Features</Typography>
        <Typography variant="body1" gutterBottom={true}>
          <ul>
            <li>
              <strong>Practice with Your Real Keymap</strong>
              <br />
              The practice module recognizes your actual custom keymap, so you
              can practice exactly how your keyboard is configured.
            </li>
            <li>
              <strong>Diverse Practice Categories</strong>
              <br />
              Choose from various categories to suit your level and needs:
              <ul>
                <li>Alphabet (Easy & Hard)</li>
                <li>Numbers and Symbols</li>
                <li>Alphanumeric</li>
                <li>TypeScript Type Definitions</li>
                <li>Programming Languages (JavaScript, Python)</li>
                <li>Remap UI Phrases</li>
              </ul>
            </li>
            <li>
              <strong>Seamless Integration</strong>
              <br />
              Access typing practice directly from the Top page. For a smooth
              experience, it can even start automatically right after you
              connect your keyboard!
            </li>
            <li>
              <strong>Clean and Compact UI</strong>
              <br />
              The interface is designed to be distraction-free, allowing you to
              focus entirely on your typing flow.
            </li>
          </ul>
        </Typography>
        <Typography variant="h4">How to Access</Typography>
        <Typography variant="body1" gutterBottom={true}>
          Simply visit the Remap Top page. You&apos;ll find the{' '}
          <strong>Typing Practice</strong> card ready for you. Connect your
          keyboard, select a category, and start typing!
        </Typography>
        <Typography variant="h4">Perfect Your Workflow</Typography>
        <Typography variant="body1" gutterBottom={true}>
          Whether you&apos;ve just adjusted a few keys or completely overhauled
          your layout, use <strong>Typing Practice</strong> to make your custom
          keyboard feel like a natural extension of your hands.
        </Typography>
      </section>
      <section>
        <Typography variant="body1" align="right">
          Written on: Jan 19th, 2026
        </Typography>
      </section>
    </React.Fragment>
  );
}
