import React, { useState } from 'react';
import {
  BuildFormActionsType,
  BuildFormStateType,
} from './BuildForm.container';
import './BuildForm.scss';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION,
  IBuildableFirmwareFile,
  IBuildableFirmwareFileType,
  IBuildableFirmwareQmkFirmwareVersion,
} from '../../../../services/storage/Storage';
import ConfirmDialog from '../../../common/confirm/ConfirmDialog';
import { extractBuildableFirmwareCodeParameters } from '../../../../services/build/FirmwareCodeParser';
import { IBuildableFirmwareCodeParameter } from '../../../../store/state';
import {
  ALL_BOOTLOADER_TYPE,
  IBootloaderType,
} from '../../../../services/firmware/Types';

type OwnProps = {};
type BuildFormProps = OwnProps &
  Partial<BuildFormActionsType> &
  Partial<BuildFormStateType>;

export default function BuildForm(props: BuildFormProps) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [keyboardDirectoryName, setKeyboardDirectoryName] = useState<string>(
    props.buildableFirmware!.keyboardDirectoryName,
  );

  const onClickSupportBuildingFirmware = () => {
    props.updateBuildableFirmwareEnabled!(
      props.keyboardDefinition!.id,
      !props.buildableFirmware!.enabled,
    );
  };

  const onClickAddKeyboardFile = () => {
    const fileName = `${Date.now()}.txt`;
    props.createNewFirmwareKeyboardFile!(
      props.keyboardDefinition!.id,
      fileName,
    );
  };

  const onClickAddKeymapFile = () => {
    const fileName = `${Date.now()}.txt`;
    props.createNewFirmwareKeymapFile!(props.keyboardDefinition!.id, fileName);
  };

  const onClickFirmwareFile = (
    file: IBuildableFirmwareFile,
    type: IBuildableFirmwareFileType,
  ) => {
    props.updateTargetBuildableFirmwareFile!(file, type);
    const parameters = extractBuildableFirmwareCodeParameters(file.content);
    props.updateBuildableFirmwareCodeParameters!(parameters);
  };

  const onChangeFileName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const path = event.target.value;
    if (props.targetBuildableFirmwareFile) {
      const file: IBuildableFirmwareFile = {
        ...props.targetBuildableFirmwareFile,
        path,
      };
      props.updateTargetBuildableFirmwareFile!(
        file,
        props.targetBuildableFirmwareFileType!,
      );
    }
  };

  const onChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const content = event.target.value;
    if (props.targetBuildableFirmwareFile) {
      const file: IBuildableFirmwareFile = {
        ...props.targetBuildableFirmwareFile,
        content,
      };
      props.updateTargetBuildableFirmwareFile!(
        file,
        props.targetBuildableFirmwareFileType!,
      );
      const parameters = extractBuildableFirmwareCodeParameters(content);
      props.updateBuildableFirmwareCodeParameters!(parameters);
    }
  };

  const onClickSave = () => {
    if (
      props.targetBuildableFirmwareFile &&
      props.targetBuildableFirmwareFileType
    ) {
      props.updateBuildableFirmwareFile!(
        props.keyboardDefinition!.id,
        props.targetBuildableFirmwareFile,
        props.targetBuildableFirmwareFileType,
      );
    }
  };

  const onClickDelete = () => {
    if (props.targetBuildableFirmwareFile) {
      setOpenConfirmDialog(true);
    }
  };

  const onClickConfirmDialogYes = () => {
    setOpenConfirmDialog(false);
    if (
      props.targetBuildableFirmwareFile &&
      props.targetBuildableFirmwareFileType
    ) {
      props.deleteBuildableFirmwareFile!(
        props.keyboardDefinition!.id,
        props.targetBuildableFirmwareFile,
        props.targetBuildableFirmwareFileType,
      );
    }
  };

  const onClickConfirmDialogNo = () => {
    setOpenConfirmDialog(false);
  };

  const onChangeDefaultBootloaderType = (
    event: SelectChangeEvent<IBootloaderType>,
  ) => {
    props.updateBuildableFirmwareDefaultBootloaderType!(
      props.keyboardDefinition!.id,
      event.target.value as IBootloaderType,
    );
  };

  const onChangeQmkFirmwareVersion = (
    event: SelectChangeEvent<IBuildableFirmwareQmkFirmwareVersion>,
  ) => {
    props.updateBuildableFirmwareQmkFirmwareVersion!(
      props.keyboardDefinition!.id,
      event.target.value as IBuildableFirmwareQmkFirmwareVersion,
    );
  };

  const onChangeSupportCodeEditing = (event: SelectChangeEvent) => {
    props.updateBuildableFirmwareSupportCodeEditing!(
      props.keyboardDefinition!.id,
      event.target.value === 'true',
    );
  };

  const onChangeKeyboardDirectoryName = () => {
    if (
      keyboardDirectoryName !== props.buildableFirmware!.keyboardDirectoryName
    ) {
      props.updateBuildableFirmwareKeyboardDirectoryName!(
        props.keyboardDefinition!.id,
        keyboardDirectoryName,
      );
    }
  };

  return (
    <React.Fragment>
      <div className="edit-definition-build-form-container">
        <div className="edit-definition-build-form-row">
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={props.buildableFirmware!.enabled} />}
              onChange={onClickSupportBuildingFirmware}
              label="Support building QMK Firmware"
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                mt: 2,
                mb: 2,
                gap: 2,
              }}
            >
              <FormControl
                fullWidth
                size="small"
                variant="standard"
                disabled={!props.buildableFirmware!.enabled}
              >
                <InputLabel id="building-firmware-type">
                  Default Bootloader Type
                </InputLabel>
                <Select
                  labelId="building-firmware-type"
                  value={props.buildableFirmware!.defaultBootloaderType}
                  label="Default Bootloader Type"
                  onChange={onChangeDefaultBootloaderType}
                >
                  {ALL_BOOTLOADER_TYPE.map((type) => (
                    <MenuItem key={`bootloader-type-${type}`} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                variant="standard"
                disabled={!props.buildableFirmware!.enabled}
              >
                <InputLabel id="building-firmware-qmk-firmware-version">
                  QMK Firmware Version
                </InputLabel>
                <Select
                  labelId="building-firmware-qmk-firmware-version"
                  value={props.buildableFirmware!.qmkFirmwareVersion}
                  label="QMK Firmware Version"
                  onChange={onChangeQmkFirmwareVersion}
                >
                  {BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION.map((type) => (
                    <MenuItem key={`qmk-firmware-version-${type}`} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                variant="standard"
                disabled={!props.buildableFirmware!.enabled}
              >
                <InputLabel id="building-firmware-support-code-editing">
                  Support Code Editing
                </InputLabel>
                <Select
                  labelId="building-firmware-support-code-editing"
                  value={
                    props.buildableFirmware!.supportCodeEditing
                      ? 'true'
                      : 'false'
                  }
                  label="Support Code Editing"
                  onChange={onChangeSupportCodeEditing}
                >
                  <MenuItem value="true">Supported</MenuItem>
                  <MenuItem value="false">Not Supported</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                label="Keyboard Directory Name"
                placeholder="Keyboard Directory Name (Optional)"
                helperText="If filled, files will be placed in a subdirectory with the name. Otherwise, files will be placed in the directory named with a random string. When you want to create `KEYBOARD_NAME.h` and/or `KEYBOARD_NAME.c` files, you should fill this field."
                fullWidth
                size="small"
                value={keyboardDirectoryName}
                onChange={(event) => {
                  setKeyboardDirectoryName(event.target.value);
                }}
                onBlur={onChangeKeyboardDirectoryName}
              />
            </Box>
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
                    <FirmwareFileListItem
                      key={`buildable-keyboard-file-${file.id}`}
                      buildableFirmwareFile={file}
                      disabled={!props.buildableFirmware!.enabled}
                      selected={
                        props.targetBuildableFirmwareFile?.id === file.id &&
                        props.targetBuildableFirmwareFileType === 'keyboard'
                      }
                      buildableFirmwareFileType="keyboard"
                      onClick={onClickFirmwareFile}
                    />
                  ))}
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="add"
                        disabled={!props.buildableFirmware!.enabled}
                        onClick={onClickAddKeymapFile}
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
                  {props.buildableFirmwareKeymapFiles!.map((file) => (
                    <FirmwareFileListItem
                      key={`buildable-keymap-file-${file.id}`}
                      buildableFirmwareFile={file}
                      disabled={!props.buildableFirmware!.enabled}
                      selected={
                        props.targetBuildableFirmwareFile?.id === file.id &&
                        props.targetBuildableFirmwareFileType === 'keymap'
                      }
                      buildableFirmwareFileType="keymap"
                      onClick={onClickFirmwareFile}
                    />
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Paper>
                <Container sx={{ py: 2 }}>
                  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Typography color="inherit">Keyboards</Typography>
                    <Typography color="inherit">...</Typography>
                    {props.targetBuildableFirmwareFileType === 'keymap' && [
                      <Typography
                        color="inherit"
                        key="buildable-firmware-file-breadcrumb-1"
                      >
                        keymaps
                      </Typography>,
                      <Typography
                        color="inherit"
                        key="buildable-firmware-file-breadcrumb-2"
                      >
                        remap
                      </Typography>,
                      <Typography
                        color="inherit"
                        key="buildable-firmware-file-breadcrumb-3"
                      >
                        ...
                      </Typography>,
                    ]}
                  </Breadcrumbs>
                  <TextField
                    label="File Name"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    disabled={props.targetBuildableFirmwareFile === null}
                    value={props.targetBuildableFirmwareFile?.path || ''}
                    onChange={onChangeFileName}
                  />
                  <TextField
                    label="Content"
                    variant="outlined"
                    multiline
                    minRows={10}
                    maxRows={10}
                    fullWidth
                    margin="normal"
                    disabled={props.targetBuildableFirmwareFile === null}
                    value={props.targetBuildableFirmwareFile?.content || ''}
                    onChange={onChangeContent}
                  />
                  <Typography variant="caption" sx={{ mb: 2 }} component="p">
                    This content can have custom parameters. See:{' '}
                    <a href="/docs/build">Custom Parameters</a>
                  </Typography>
                  {props.targetBuildableFirmwareCodeParameters!.length > 0 && (
                    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
                      <TableContainer sx={{ maxHeight: 150 }}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Default</TableCell>
                              <TableCell>Options</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {props.targetBuildableFirmwareCodeParameters!.map(
                              (parameter: IBuildableFirmwareCodeParameter) => (
                                <TableRow
                                  key={`buildable-firmware-code-parameter-${parameter.name}`}
                                >
                                  <TableCell>{parameter.name}</TableCell>
                                  <TableCell>{parameter.type}</TableCell>
                                  <TableCell>{parameter.default}</TableCell>
                                  <TableCell>
                                    {parameter.options
                                      ? parameter.options.join(', ')
                                      : ''}
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  )}
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="text"
                      disabled={props.targetBuildableFirmwareFile === null}
                      onClick={onClickDelete}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      disabled={
                        props.targetBuildableFirmwareFile === undefined ||
                        props.targetBuildableFirmwareFile === null ||
                        props.targetBuildableFirmwareFile.path === ''
                      }
                      onClick={onClickSave}
                    >
                      Save
                    </Button>
                  </Stack>
                </Container>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
      <ConfirmDialog
        open={openConfirmDialog}
        title="Firmware File Deletion"
        message="Are you sure to delete the firmware file?"
        onClickYes={onClickConfirmDialogYes}
        onClickNo={onClickConfirmDialogNo}
      />
    </React.Fragment>
  );
}

type FirmwareFileListItemProps = {
  disabled: boolean;
  selected: boolean;
  buildableFirmwareFile: IBuildableFirmwareFile;
  buildableFirmwareFileType: IBuildableFirmwareFileType;
  onClick: (
    // eslint-disable-next-line no-unused-vars
    file: IBuildableFirmwareFile,
    // eslint-disable-next-line no-unused-vars
    type: IBuildableFirmwareFileType,
  ) => void;
};

function FirmwareFileListItem(props: FirmwareFileListItemProps) {
  return (
    <ListItemButton
      sx={{ pl: 4 }}
      disabled={props.disabled}
      selected={props.selected}
      onClick={() => {
        props.onClick(
          props.buildableFirmwareFile,
          props.buildableFirmwareFileType,
        );
      }}
    >
      <ListItemIcon>
        <InsertDriveFileIcon />
      </ListItemIcon>
      <ListItemText primary={props.buildableFirmwareFile.path} />
    </ListItemButton>
  );
}
