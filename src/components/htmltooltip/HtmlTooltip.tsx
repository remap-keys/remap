import { Theme, Tooltip } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const HtmlTooltip = withStyles(Tooltip, (theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
