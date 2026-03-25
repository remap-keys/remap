import React from 'react';
import { Box, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { t } from 'i18next';

type LayerSelectorProps = {
  layerCount: number;
  selectedLayer: number;
  // eslint-disable-next-line no-unused-vars
  onSelectLayer: (layer: number) => void;
  onAddLayer: () => void;
  onDeleteLayer: () => void;
};

export default function LayerSelector({
  layerCount,
  selectedLayer,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
}: LayerSelectorProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Tabs
        value={selectedLayer}
        onChange={(_, newValue) => onSelectLayer(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ flexGrow: 1, minHeight: 36 }}
      >
        {Array.from({ length: layerCount }, (_, i) => (
          <Tab
            key={i}
            label={`${t('Layer')} ${i}`}
            sx={{ minHeight: 36, py: 0.5, textTransform: 'none' }}
          />
        ))}
      </Tabs>
      <Tooltip title={t('Add layer')}>
        <IconButton size="small" onClick={onAddLayer}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Delete layer')}>
        <span>
          <IconButton
            size="small"
            onClick={onDeleteLayer}
            disabled={layerCount <= 1}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
