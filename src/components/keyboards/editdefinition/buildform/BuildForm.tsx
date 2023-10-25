import React from 'react';
import {
  BuildFormActionsType,
  BuildFormStateType,
} from './BuildForm.container';
import './BuildForm.scss';
import {
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Input } from '@mui/icons-material';

type OwnProps = {};
type BuildFormProps = OwnProps &
  Partial<BuildFormActionsType> &
  Partial<BuildFormStateType>;

export default function BuildForm(props: BuildFormProps) {
  return (
    <div className="edit-definition-build-form-container">
      <div className="edit-definition-build-form-row">
        <FormGroup>
          <FormControlLabel
            control={<Switch />}
            label="Support building QMK Firmware"
          />
        </FormGroup>
      </div>
      <div className="edit-definition-build-form-row">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader-firmware-files"
                subheader={
                  <ListSubheader
                    component="div"
                    id="nested-list-subheader-firmware-files"
                  >
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
                  <ListItemText primary="Keyboard" />
                </ListItem>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText primary="config.h" />
                </ListItemButton>
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
                  <ListItemText primary="Keymap" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper>
              <Container sx={{ py: 2 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                  <Typography color="inherit">Keyboards</Typography>
                  <Typography color="inherit">YOUR_KEYBOARD</Typography>
                  <Typography color="inherit">keymaps</Typography>
                  <Typography color="inherit">remap</Typography>
                  <Typography color="text.primary">config.h</Typography>
                </Breadcrumbs>
                <TextField
                  label="File Name"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Content"
                  variant="outlined"
                  multiline
                  minRows={10}
                  maxRows={10}
                  fullWidth
                  margin="normal"
                  sx={{ mb: 2 }}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="text">Delete</Button>
                  <Button variant="contained">Save</Button>
                </Stack>
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
