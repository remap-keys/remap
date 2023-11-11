import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  IBuildableFirmwareFile,
  IBuildableFirmwareFileType,
} from '../../../../services/storage/Storage';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import './BuildParametersDialog.scss';
import {
  BuildParametersDialogActionsType,
  BuildParametersDialogStateType,
} from './BuildParametersDialog.container';
import {
  IBuildableFirmwareCodeParameter,
  IBuildableFirmwareCodeParameterValues,
} from '../../../../store/state';

type OwnProps = {
  open: boolean;
  onClickClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onClickBuild: (description: string) => void;
};
type BuildParametersDialogProps = OwnProps &
  Partial<BuildParametersDialogActionsType> &
  Partial<BuildParametersDialogStateType>;

type SelectedFirmwareFile = {
  file: IBuildableFirmwareFile;
  type: IBuildableFirmwareFileType;
};

export default function BuildParametersDialog(
  props: BuildParametersDialogProps
) {
  const [selectedFirmwareFile, setSelectedFirmwareFile] = useState<
    SelectedFirmwareFile | undefined
  >(undefined);
  const [description, setDescription] = useState<string>('');
  const [originalParameterValues, setOriginalParameterValues] = useState<
    IBuildableFirmwareCodeParameterValues | undefined
  >(undefined);

  useEffect(() => {
    if (props.open) {
      setSelectedFirmwareFile(undefined);
      setDescription('');
      setOriginalParameterValues(
        structuredClone(props.buildableFirmwareCodeParameterValues)
      );
    }
  }, [props.open]);

  const onClickFirmwareFile = (
    file: IBuildableFirmwareFile,
    type: IBuildableFirmwareFileType
  ) => {
    setSelectedFirmwareFile({ file, type });
  };

  const onChangeParameterValue = (
    targetFirmwareFile: SelectedFirmwareFile,
    targetParameter: IBuildableFirmwareCodeParameter,
    newValue: string
  ) => {
    const newParameterValues = structuredClone(
      props.buildableFirmwareCodeParameterValues
    ) as IBuildableFirmwareCodeParameterValues;
    const newValueMap =
      targetFirmwareFile.type === 'keyboard'
        ? newParameterValues.keyboard
        : newParameterValues.keymap;
    const newParameterValueMap = newValueMap[targetFirmwareFile.file.id];
    newParameterValueMap[targetParameter.name].value = newValue;
    props.updateBuildableFirmwareCodeParameterValues!(newParameterValues);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const isDifferent = (
    fileType: IBuildableFirmwareFileType,
    file: IBuildableFirmwareFile
  ): boolean => {
    if (!originalParameterValues) {
      return false;
    }
    const originalValueMap =
      fileType === 'keyboard'
        ? originalParameterValues.keyboard
        : originalParameterValues.keymap;
    const originalParameterValueMap = originalValueMap[file.id];
    const newValueMap =
      fileType === 'keyboard'
        ? props.buildableFirmwareCodeParameterValues!.keyboard
        : props.buildableFirmwareCodeParameterValues!.keymap;
    const newParameterValueMap = newValueMap[file.id];
    const originalParameterValueMapEntries = Object.entries(
      originalParameterValueMap
    );
    const newParameterValueMapEntries = Object.entries(
      newParameterValueMap
    ).filter(
      ([parameterName, parameter]) =>
        parameter.value === originalParameterValueMap[parameterName].value
    );
    return (
      originalParameterValueMapEntries.length !==
      newParameterValueMapEntries.length
    );
  };

  return (
    <Dialog open={props.open} maxWidth="md" fullWidth>
      <DialogTitle>Build Parameters</DialogTitle>
      <DialogContent dividers className="build-parameters-dialog-content">
        <TextField
          fullWidth
          label="Memorandum"
          placeholder="Fill in the memorandum of this build."
          variant="outlined"
          sx={{ mb: 2 }}
          value={description}
          onChange={onChangeDescription}
        />
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
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Keyboard" />
                </ListItem>
                {props.buildableFirmwareKeyboardFiles!.map((file) => (
                  <FirmwareFileListItem
                    key={`buildable-keyboard-file-${file.id}`}
                    buildableFirmwareFile={file}
                    selected={
                      selectedFirmwareFile?.file.id === file.id &&
                      selectedFirmwareFile?.type === 'keyboard'
                    }
                    buildableFirmwareFileType="keyboard"
                    onClick={() => onClickFirmwareFile(file, 'keyboard')}
                    diff={isDifferent('keyboard', file)}
                  />
                ))}
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Keymap" />
                </ListItem>
                {props.buildableFirmwareKeymapFiles!.map((file) => (
                  <FirmwareFileListItem
                    key={`buildable-keymap-file-${file.id}`}
                    buildableFirmwareFile={file}
                    selected={
                      selectedFirmwareFile?.file.id === file.id &&
                      selectedFirmwareFile?.type === 'keymap'
                    }
                    buildableFirmwareFileType="keymap"
                    onClick={() => onClickFirmwareFile(file, 'keymap')}
                    diff={isDifferent('keymap', file)}
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            {selectedFirmwareFile && (
              <Paper>
                <Container sx={{ py: 2 }}>
                  <ParameterEditors
                    selectedFirmwareFile={selectedFirmwareFile}
                    buildableFirmwareCodeParameterValues={
                      props.buildableFirmwareCodeParameterValues!
                    }
                    onChangeParameterValue={onChangeParameterValue}
                  />
                </Container>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="primary"
          autoFocus
          onClick={() => {
            props.onClickClose();
          }}
          sx={{ mr: 2 }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.onClickBuild(description);
          }}
        >
          Build
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type FirmwareFileListItemProps = {
  selected: boolean;
  buildableFirmwareFile: IBuildableFirmwareFile;
  buildableFirmwareFileType: IBuildableFirmwareFileType;
  onClick: (
    // eslint-disable-next-line no-unused-vars
    file: IBuildableFirmwareFile,
    // eslint-disable-next-line no-unused-vars
    type: IBuildableFirmwareFileType
  ) => void;
  diff: boolean;
};

function FirmwareFileListItem(props: FirmwareFileListItemProps) {
  return (
    <ListItemButton
      sx={{ pl: 4 }}
      selected={props.selected}
      onClick={() => {
        props.onClick(
          props.buildableFirmwareFile,
          props.buildableFirmwareFileType
        );
      }}
    >
      <ListItemIcon>
        {props.diff ? (
          <Badge color="secondary" variant="dot">
            <InsertDriveFileIcon />
          </Badge>
        ) : (
          <InsertDriveFileIcon />
        )}
      </ListItemIcon>
      <ListItemText primary={props.buildableFirmwareFile.path} />
    </ListItemButton>
  );
}

type ParameterEditorProps = {
  selectedFirmwareFile: SelectedFirmwareFile;
  buildableFirmwareCodeParameterValues: IBuildableFirmwareCodeParameterValues;
  onChangeParameterValue: (
    // eslint-disable-next-line no-unused-vars
    selectedFirmwareFile: SelectedFirmwareFile,
    // eslint-disable-next-line no-unused-vars
    selectedParameter: IBuildableFirmwareCodeParameter,
    // eslint-disable-next-line no-unused-vars
    newValue: string
  ) => void;
};

function ParameterEditors(props: ParameterEditorProps) {
  const valueMap =
    props.selectedFirmwareFile.type === 'keyboard'
      ? props.buildableFirmwareCodeParameterValues.keyboard
      : props.buildableFirmwareCodeParameterValues.keymap;
  const parameterValueMap = valueMap[props.selectedFirmwareFile.file.id];

  const parameterValueMapEntries = Object.entries(parameterValueMap);
  return (
    <Grid container spacing={2}>
      {parameterValueMapEntries.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="body1">No parameters available.</Typography>
        </Grid>
      ) : (
        parameterValueMapEntries.map(([parameterName, parameter]) => (
          <React.Fragment key={`parameter-editor-${parameter.definition.name}`}>
            <Grid item xs={4}>
              <Typography>{parameterName}</Typography>
            </Grid>
            <Grid item xs={8}>
              {parameter.definition.type === 'text' ? (
                <TextField
                  fullWidth
                  size="small"
                  value={parameter.value}
                  variant="outlined"
                  onChange={(event) => {
                    props.onChangeParameterValue(
                      props.selectedFirmwareFile,
                      parameter.definition,
                      event.target.value
                    );
                  }}
                />
              ) : parameter.definition.type === 'select' ? (
                <Select
                  fullWidth
                  size="small"
                  value={parameter.value}
                  onChange={(event) => {
                    props.onChangeParameterValue(
                      props.selectedFirmwareFile,
                      parameter.definition,
                      event.target.value
                    );
                  }}
                >
                  {parameter.definition.options.map((option) => (
                    <MenuItem value={option} key={`parameter-option-${option}`}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              ) : parameter.definition.type === 'number' ? (
                <TextField
                  fullWidth
                  size="small"
                  value={parameter.value}
                  variant="outlined"
                  type="number"
                  onChange={(event) => {
                    props.onChangeParameterValue(
                      props.selectedFirmwareFile,
                      parameter.definition,
                      event.target.value
                    );
                  }}
                />
              ) : null}
            </Grid>
          </React.Fragment>
        ))
      )}
    </Grid>
  );
}
