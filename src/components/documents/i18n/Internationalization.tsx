import React from 'react';
import { Typography } from '@mui/material';

export default function Internationalization() {
  return (
    <React.Fragment>
      <Typography variant="h3">Japanese Language Support</Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          Remap has always been available in English only, but now it also
          supports Japanese. If your web browser's language is set to Japanese,
          Remap will automatically be displayed in Japanese. This update
          enhances convenience for users whose native language is Japanese.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          If you prefer Japanese but the interface is still in English, please
          check whether your web browser's language settings are set to
          Japanese. Additionally, verify that your OS language settings are also
          set to Japanese.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          If you wish to continue using Remap in English, you can do one of the
          following:
          <ul>
            <li>Change your web browser's language settings to English.</li>
            <li>
              Add <code>?lng=en</code> to the end of the URL when accessing
              Remap.
            </li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          By appending <code>?lng=en</code> or <code>?lng=ja</code> to the URL,
          you can force Remap to display in the specified language. The selected
          language will be remembered the next time you access Remap.
          Specifically, the language setting is stored in{' '}
          <code>localStorage</code> under the key name <code>i18nextLng</code>.
          If you encounter any issues, try deleting the
          <code>i18nextLng</code> entry from <code>localStorage</code>.
        </Typography>
      </section>
    </React.Fragment>
  );
}
