import React from 'react';
import './CatalogBuild.scss';
import {
  CatalogBuildActionsType,
  CatalogBuildStateType,
} from './CatalogBuild.container';
import { Box, Button, Paper } from '@mui/material';
type OwnProps = {};
type CatalogBuildProps = OwnProps &
  Partial<CatalogBuildActionsType> &
  Partial<CatalogBuildStateType>;

export default function CatalogBuild(props: CatalogBuildProps) {
  return (
    <div className="catalog-build-container">
      <Paper sx={{ p: '16px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained">Build</Button>
        </Box>
      </Paper>
    </div>
  );
}
