import React, { useCallback, useEffect, useState } from 'react';
import {
  BreadboardActionsType,
  BreadboardStateType,
} from './Breadboard.container';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
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
import EditIcon from '@mui/icons-material/Edit';
import { Editor } from '@monaco-editor/react';
import {
  IBuildableFirmwareFileType,
  IWorkbenchProjectFile,
} from '../../../services/storage/Storage';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { CreateNewWorkbenchProjectFileDialog } from './CreateNewWorkbenchProjectFileDialog';
import { EditWorkbenchProjectFileDialog } from './EditWorkbenchProjectFileDialog';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import { useDebounce } from '../../common/hooks/DebounceHook';

type OwnProps = {};
type BreadboardProps = OwnProps &
  Partial<BreadboardActionsType> &
  Partial<BreadboardStateType>;

export default function Breadboard(
  props: BreadboardProps | Readonly<BreadboardProps>
) {
  // States

  const [openCreateNewFileDialog, setOpenCreateNewFileDialog] =
    useState<boolean>(false);
  const [targetCreateNewFileType, setTargetCreateNewFileType] =
    useState<IBuildableFirmwareFileType>('keyboard');
  const [openEditFileDialog, setOpenEditFileDialog] = useState<boolean>(false);
  const [targetEditFileType, setTargetEditFileType] =
    useState<IBuildableFirmwareFileType>('keyboard');
  const [targetEditFile, setTargetEditFile] = useState<
    IWorkbenchProjectFile | undefined
  >(undefined);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [targetDeleteFile, setTargetDeleteFile] = useState<
    IWorkbenchProjectFile | undefined
  >(undefined);
  const [selectedFile, setSelectedFile] = useState<
    { fileId: string; fileType: IBuildableFirmwareFileType } | undefined
  >(undefined);
  const [code, setCode] = useState<string>('abc');

  // Effects

  useEffect(() => {
    if (props.currentProject === undefined || selectedFile === undefined) {
      setCode('');
      return;
    }
    const currentFile =
      selectedFile.fileType === 'keyboard'
        ? props.currentProject.keyboardFiles.find(
            (file) => file.id === selectedFile.fileId
          )
        : props.currentProject.keymapFiles.find(
            (file) => file.id === selectedFile.fileId
          );
    if (currentFile === undefined) {
      setCode('');
      return;
    }
    setCode(currentFile.code);
  }, [props.currentProject, selectedFile]);

  const debounceCode = useDebounce(code, 500);
  useEffect(() => {
    if (props.currentProject === undefined || selectedFile === undefined) {
      return;
    }
    const currentFile =
      selectedFile.fileType === 'keyboard'
        ? props.currentProject.keyboardFiles.find(
            (file) => file.id === selectedFile.fileId
          )
        : props.currentProject.keymapFiles.find(
            (file) => file.id === selectedFile.fileId
          );
    if (currentFile === undefined) {
      return;
    }
    props.updateWorkbenchProjectFile!(
      props.currentProject!,
      currentFile,
      currentFile.path,
      debounceCode
    );
  }, [debounceCode]);

  // Event Handlers

  const onClickWorkbenchProjectFile = (
    file: IWorkbenchProjectFile,
    fileType: IBuildableFirmwareFileType
  ) => {
    setSelectedFile({ fileId: file.id, fileType });
  };

  const onClickCreateNewWorkbenchProjectFile =
    (fileType: IBuildableFirmwareFileType) => () => {
      setTargetCreateNewFileType(fileType);
      setOpenCreateNewFileDialog(true);
    };

  const onSubmitCreateNewWorkbenchProjectFileDialog = (
    path: string,
    fileType: IBuildableFirmwareFileType
  ) => {
    props.createNewWorkbenchProjectFile!(props.currentProject!, path, fileType);
    setOpenCreateNewFileDialog(false);
  };

  const onClickEditWorkbenchProjectFile = (
    file: IWorkbenchProjectFile,
    fileType: IBuildableFirmwareFileType
  ) => {
    setTargetEditFile(file);
    setTargetEditFileType(fileType);
    setOpenEditFileDialog(true);
  };

  const onSubmitEditWorkbenchProjectFileDialog = (
    path: string,
    file: IWorkbenchProjectFile | undefined,
    _fileType: IBuildableFirmwareFileType
  ) => {
    if (file === undefined) {
      return;
    }
    props.updateWorkbenchProjectFile!(
      props.currentProject!,
      file,
      path,
      file.code
    );
    setOpenEditFileDialog(false);
  };

  const onDeleteEditWorkbenchProjectFileDialog = (
    file: IWorkbenchProjectFile | undefined,
    _fileType: IBuildableFirmwareFileType
  ) => {
    setOpenEditFileDialog(false);
    if (file === undefined) {
      return;
    }
    setTargetDeleteFile(file);
    setOpenConfirmDialog(true);
  };

  const onClickDeleteFile = () => {
    if (targetDeleteFile === undefined) {
      return;
    }
    const targetFileId = targetDeleteFile.id;
    const targetFileType = targetDeleteFile.fileType;
    props.deleteWorkbenchProjectFile!(
      props.currentProject!,
      targetDeleteFile,
      targetEditFileType
    );
    setOpenConfirmDialog(false);
    // If the deleted file is the selected file, clear the selected file.
    if (
      selectedFile !== undefined &&
      selectedFile.fileId === targetFileId &&
      selectedFile.fileType === targetFileType
    ) {
      setSelectedFile(undefined);
    }
  };

  const onChangeCode = useCallback((code: string | undefined) => {
    setCode(code || '');
  }, []);

  // Render

  return (
    <>
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
            <Paper variant="elevation" sx={{ flex: '4' }}>
              <List
                sx={{ width: '100%', height: '100%', overflowY: 'auto' }}
                subheader={
                  <ListSubheader component="div" id="file-list-subheader">
                    Project
                  </ListSubheader>
                }
              >
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="add"
                      onClick={onClickCreateNewWorkbenchProjectFile('keyboard')}
                    >
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="keyboards/.../" />
                </ListItem>
                {props
                  .currentProject!.keyboardFiles.toSorted((a, b) =>
                    a.path.localeCompare(b.path)
                  )
                  .map((file) => (
                    <WorkbenchProjectFileListItem
                      key={`workbench-keyboard-file-${file.id}`}
                      workbenchProjectFile={file}
                      workbenchProjectFileType="keyboard"
                      disabled={false}
                      selected={
                        selectedFile !== undefined &&
                        selectedFile.fileType === 'keyboard' &&
                        selectedFile.fileId === file.id
                      }
                      onClickFile={(
                        file: IWorkbenchProjectFile,
                        fileType: IBuildableFirmwareFileType
                      ) => {
                        onClickWorkbenchProjectFile(file, fileType);
                      }}
                      onClickEditFile={onClickEditWorkbenchProjectFile}
                    />
                  ))}
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="add"
                      onClick={onClickCreateNewWorkbenchProjectFile('keymap')}
                    >
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="keymaps/.../" />
                </ListItem>
                {props
                  .currentProject!.keymapFiles.toSorted((a, b) =>
                    a.path.localeCompare(b.path)
                  )
                  .map((file) => (
                    <WorkbenchProjectFileListItem
                      key={`workbench-keymap-file-${file.id}`}
                      workbenchProjectFile={file}
                      workbenchProjectFileType="keymap"
                      disabled={false}
                      selected={
                        selectedFile !== undefined &&
                        selectedFile.fileType === 'keymap' &&
                        selectedFile.fileId === file.id
                      }
                      onClickFile={(
                        file: IWorkbenchProjectFile,
                        fileType: IBuildableFirmwareFileType
                      ) => {
                        onClickWorkbenchProjectFile(file, fileType);
                      }}
                      onClickEditFile={onClickEditWorkbenchProjectFile}
                    />
                  ))}
              </List>
            </Paper>
            <Paper
              variant="elevation"
              sx={{
                flex: '10',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {props.currentProject !== undefined &&
                selectedFile !== undefined && (
                  <Editor
                    defaultLanguage="c"
                    height="100%"
                    value={code}
                    options={{
                      minimap: { enabled: false },
                      wordWrap: 'off',
                      automaticLayout: true,
                    }}
                    onChange={onChangeCode}
                  />
                )}
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
      <CreateNewWorkbenchProjectFileDialog
        open={openCreateNewFileDialog}
        onClose={() => {
          setOpenCreateNewFileDialog(false);
        }}
        fileType={targetCreateNewFileType}
        workbenchProject={props.currentProject}
        onSubmit={onSubmitCreateNewWorkbenchProjectFileDialog}
      />
      <EditWorkbenchProjectFileDialog
        open={openEditFileDialog}
        onClose={() => {
          setOpenEditFileDialog(false);
        }}
        file={targetEditFile}
        fileType={targetEditFileType}
        workbenchProject={props.currentProject}
        onSubmit={onSubmitEditWorkbenchProjectFileDialog}
        onDelete={onDeleteEditWorkbenchProjectFileDialog}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirm"
        message={`Are you sure you want to delete "${targetDeleteFile?.path}" file?`}
        onClickYes={onClickDeleteFile}
        onClickNo={() => {
          setOpenConfirmDialog(false);
        }}
      />
    </>
  );
}

type WorkbenchProjectFileListItemProps = {
  disabled: boolean;
  selected: boolean;
  workbenchProjectFile: IWorkbenchProjectFile;
  workbenchProjectFileType: IBuildableFirmwareFileType;
  onClickFile: (
    file: IWorkbenchProjectFile,
    type: IBuildableFirmwareFileType
  ) => void;
  onClickEditFile: (
    file: IWorkbenchProjectFile,
    type: IBuildableFirmwareFileType
  ) => void;
};

function WorkbenchProjectFileListItem(
  props: WorkbenchProjectFileListItemProps
) {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => {
            props.onClickEditFile(
              props.workbenchProjectFile,
              props.workbenchProjectFileType
            );
          }}
        >
          <EditIcon />
        </IconButton>
      }
    >
      <ListItemButton
        sx={{ pl: 4 }}
        disabled={props.disabled}
        selected={props.selected}
        onClick={() => {
          props.onClickFile(
            props.workbenchProjectFile,
            props.workbenchProjectFileType
          );
        }}
      >
        <ListItemIcon>
          <InsertDriveFileIcon />
        </ListItemIcon>
        <ListItemText primary={props.workbenchProjectFile.path} />
      </ListItemButton>
    </ListItem>
  );
}
