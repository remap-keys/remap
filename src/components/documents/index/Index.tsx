import { Link, Typography } from '@mui/material';
import React from 'react';

export default function Index() {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
