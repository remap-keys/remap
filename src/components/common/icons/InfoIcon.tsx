import React from 'react';
import { SvgIcon } from '@mui/material';

export function InfoIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M 11 7 h 2 v 2 h -2 z m 0 5 C 11 11 12 11 12 11 c 0 0 1 0 1 1 v 4 C 13 17 12 17 12 17 c 0 0 -1 0 -1 -1 z m 1 -10 C 6.48 2 2 6.48 2 12 s 4.48 10 10 10 s 10 -4.48 10 -10 S 17.52 2 12 2 z m 0 18 c -4.41 0 -8 -3.59 -8 -8 s 3.59 -8 8 -8 s 8 3.59 8 8 s -3.59 8 -8 8 z" />
    </SvgIcon>
  );
}
