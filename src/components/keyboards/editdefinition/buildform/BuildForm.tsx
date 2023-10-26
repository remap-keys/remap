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
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
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

type OwnProps = {};
type BuildFormProps = OwnProps &
  Partial<BuildFormActionsType> &
  Partial<BuildFormStateType>;

export default function BuildForm(props: BuildFormProps) {
  const onClickSupportBuildingFirmware = () => {
    props.updateBuildableFirmwareEnabled!(
      props.keyboardDefinition!.id,
      !props.buildableFirmware!.enabled
    );
  };

  const onClickAddKeyboardFile = () => {
    const fileName = `${Date.now()}.txt`;
    props.createNewFirmwareKeyboardFile!(
      props.keyboardDefinition!.id,
      fileName
    );
  };

  return (
    <div className="edit-definition-build-form-container">
      <div className="edit-definition-build-form-row">
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={props.buildableFirmware!.enabled} />}
            onChange={onClickSupportBuildingFirmware}
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
                    <IconButton
                      edge="end"
                      aria-label="add"
                      disabled={!props.buildableFirmware!.enabled}
                      onClick={onClickAddKeyboardFile}
                    >
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Keyboard" />
                </ListItem>
                {props.buildableFirmwareKeyboardFiles!.map((file) => (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    key={`buildable-keyboard-file-${file.id}`}
                  >
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={file.path} />
                  </ListItemButton>
                ))}
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="add"
                      disabled={!props.buildableFirmware!.enabled}
                    >
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
                  <Typography color="inherit">...</Typography>
                  <Typography color="inherit">keymaps</Typography>
                  <Typography color="inherit">...</Typography>
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
