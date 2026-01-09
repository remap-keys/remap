import React from 'react';
import './UnsupportedBrowser.scss';

export function UnsupportedBrowser() {
  return (
    <div className="message-box-wrapper">
      <div className="message-box">
        <h1>Unsupported Web Browser</h1>
        <p>
          <a href="https://remap-keys.app">Remap</a> works on Web Browsers which
          the <a href="https://wicg.github.io/webhid/">WebHID API</a> is
          supported.
          <br />
          For example, <a href="https://www.google.com/chrome">
            Google Chrome
          </a>{' '}
          version 89 or later supports the WebHID API.
        </p>
        <p style={{ color: 'red' }}>
          *
          <a
            href="https://developer.chrome.com/origintrials/#/view_trial/1074108511127863297"
            target="_blank"
            rel="noreferrer"
          >
            Trial for WebHID on Google Chrome (ver. 86-88)
          </a>{' '}
          has been completed. Please use the version 89 of Google Chrome stable
          which will be{' '}
          <a
            href="https://www.chromestatus.com/features/schedule"
            target="_blank"
            rel="noreferrer"
          >
            released on March 2nd
          </a>
          , or use the version 89 or higher of
          <a
            href="https://www.google.com/chrome/beta/"
            target="_blank"
            rel="noreferrer"
          >
            Google Chrome beta
          </a>{' '}
          or{' '}
          <a
            href="https://www.google.com/chrome/canary/"
            target="_blank"
            rel="noreferrer"
          >
            Google Chrome Canary
          </a>
          .
        </p>
      </div>
    </div>
  );
}
