import { Container, Link, Paper, Typography } from '@mui/material';
import React from 'react';

export default function Index() {
  return (
    <Container>
      <Paper>
        <Typography variant="h3">News</Typography>
        <section>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/i18n">
              [Feb 26th, 2025] Japanese Language Support
            </Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/statistics">
              [Dec 19th, 2023] The statistics feature is available
            </Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/support-code-editing">
              [Nov 30th, 2023] Remap supports code editing for building firmware
            </Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/build">
              [Nov 9th, 2023] Remap supports building firmware
            </Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/encoders">
              [Sep 21th, 2023] Remap supports Rotary Encoders
            </Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/support-qmk-022">
              [Sep 11th, 2023] Remap supports QMK Firmware 0.22.2 or higher
            </Link>
          </Typography>
        </section>
      </Paper>
      <Paper>
        <Typography variant="h3">Resources</Typography>
        <section>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/faq">Frequently Asked Questions</Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/terms_of_use">Terms of Use</Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link href="/docs/review_policy">Review Policy</Link>
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            <Link
              href="https://discord.gg/uf7v5DruMB"
              target="_blank"
              rel="noreferrer"
            >
              User Community
            </Link>
          </Typography>
        </section>
      </Paper>
    </Container>
  );
}
