import React from 'react';
import './AnchorTypography.scss';
import { Typography } from '@mui/material';
import { Link } from '@mui/icons-material';

export type IAnchorLinkProps = {
  id: string;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: React.ReactNode;
};

export default function AnchorTypography(props: IAnchorLinkProps) {
  return (
    <Typography variant={props.variant} className="anchor-typography">
      <a id={props.id} />
      {props.children}
      <a href={`#${props.id}`} className="anchor-typography-link">
        <Link className="anchor-typography-link-icon" />
      </a>
    </Typography>
  );
}
