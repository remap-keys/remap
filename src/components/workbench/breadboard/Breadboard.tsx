import React, { useEffect, useRef } from 'react';

import {
  BreadboardActionsType,
  BreadboardStateType,
} from './Breadboard.container';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import { Editor } from '@monaco-editor/react';

type OwnProps = {};
type BreadboardProps = OwnProps &
  Partial<BreadboardActionsType> &
  Partial<BreadboardStateType>;

export default function Breadboard(
  props: BreadboardProps | Readonly<BreadboardProps>
) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        paddingTop: '56px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '8px',
          gap: '8px',
        }}
      >
        <Box
          sx={{
            height: '70%',
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
          }}
        >
          <Paper variant="elevation" sx={{ flex: '3' }}>
            <List
              sx={{ width: '100%', height: '100%', overflowY: 'auto' }}
              subheader={
                <ListSubheader component="div" id="file-list-subheader">
                  Firmware Files
                </ListSubheader>
              }
            >
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="add">
                    <AddIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="keyboards" />
              </ListItem>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="add">
                    <AddIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="keymaps" />
              </ListItem>
            </List>
          </Paper>
          <Paper
            variant="elevation"
            sx={{
              flex: '9',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Editor
              defaultLanguage="c"
              height="100%"
              value=""
              options={{
                minimap: { enabled: false },
                wordWrap: 'off',
                automaticLayout: true,
              }}
            />
          </Paper>
        </Box>
        <Box sx={{ height: '30%', display: 'flex', flexDirection: 'row' }}>
          <Paper
            variant="elevation"
            sx={{ flex: 1, display: 'flex', flexDirection: 'row' }}
          >
            <List
              sx={{
                flex: 3,
                height: '100%',
                overflowY: 'auto',
              }}
              subheader={
                <ListSubheader component="div" id="built-list-subheader">
                  Build Tasks
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="keyboards" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="keymaps" />
              </ListItem>
            </List>
            <Box sx={{ flex: 9, display: 'flex', flexDirection: 'column' }}>
              <Tabs value={0}>
                <Tab label="Standard Output" />
                <Tab label="Standard Error" />
              </Tabs>
              <Box
                sx={{
                  overflowY: 'auto',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  output
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
