import React, { useEffect, useState } from 'react';
import {
  BreadboardActionsType,
  BreadboardStateType,
} from './Breadboard.container';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
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
  IFirmwareBuildingTask,
  IWorkbenchProject,
  IWorkbenchProjectFile,
} from '../../../services/storage/Storage';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { CreateNewWorkbenchProjectFileDialog } from '../dialogs/CreateNewWorkbenchProjectFileDialog';
import { EditWorkbenchProjectFileDialog } from '../dialogs/EditWorkbenchProjectFileDialog';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import { useDebounce } from '../../common/hooks/DebounceHook';
import { useBuildTaskHook } from './BuildTaskHook';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import FlashFirmwareDialog from '../../common/firmware/FlashFirmwareDialog.container';
import { t } from 'i18next';
import { useUserPurchaseHook } from './UserPurchaseHook';

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
  const [selectedBuildingTask, setSelectedBuildingTask] = useState<
    IFirmwareBuildingTask | undefined
  >(undefined);
  const [selectedOutputTab, setSelectedOutputTab] = useState<number>(0);

  // Effects

  useEffect(() => {
    if (props.currentProject === undefined) {
      return;
    }
    setSelectedBuildingTask(undefined);
  }, [props.currentProject]);

  useBuildTaskHook(props.currentProject?.id, props.storage?.instance);

  useUserPurchaseHook(props.storage?.instance);

  // Event Handlers

  const onClickWorkbenchProjectFile = (
    file: IWorkbenchProjectFile,
    fileType: IBuildableFirmwareFileType
  ) => {
    props.openWorkbenchProjectFile!(props.currentProject!, file, fileType);
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
      file.code,
      true
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
      props.selectedFile !== undefined &&
      props.selectedFile.fileId === targetFileId &&
      props.selectedFile.fileType === targetFileType
    ) {
      props.updateSelectedFile!(undefined);
    }
  };

  const onChangeCode = (
    file: IWorkbenchProjectFile,
    code: string | undefined
  ) => {
    if (code === undefined) {
      return;
    }
    props.updateWorkbenchProjectFile!(
      props.currentProject!,
      file,
      file.path,
      code,
      false
    );
  };

  const onClickBuildingTask = (task: IFirmwareBuildingTask) => {
    setSelectedBuildingTask(task);
  };

  const onClickFlashFirmware = (task: IFirmwareBuildingTask) => {
    props.flashFirmware!(task);
  };

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
                    {t('Project')}
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
                  <ListItemText
                    primary={`keyboards/${props.currentProject?.keyboardDirectoryName || '...'}/`}
                  />
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
                        props.selectedFile !== undefined &&
                        props.selectedFile.fileType === 'keyboard' &&
                        props.selectedFile.fileId === file.id
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
                  <ListItemText
                    primary={`keyboards/${props.currentProject?.keyboardDirectoryName || '...'}/keymaps/remap/`}
                  />
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
                        props.selectedFile !== undefined &&
                        props.selectedFile.fileType === 'keymap' &&
                        props.selectedFile.fileId === file.id
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
              <WorkbenchSourceCodeEditor
                project={props.currentProject}
                file={
                  props.currentProject === undefined
                    ? undefined
                    : props.selectedFile === undefined
                      ? undefined
                      : props.selectedFile.fileType === 'keyboard'
                        ? props.currentProject.keyboardFiles.find(
                            (file) => file.id === props.selectedFile!.fileId
                          )
                        : props.currentProject.keymapFiles.find(
                            (file) => file.id === props.selectedFile!.fileId
                          )
                }
                onChangeCode={onChangeCode}
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
                  flex: 4,
                  height: '100%',
                  overflowY: 'auto',
                }}
                subheader={
                  <ListSubheader component="div" id="built-list-subheader">
                    {t('Build Tasks')}
                  </ListSubheader>
                }
              >
                {props.buildingTasks?.map((task) => (
                  <ListItem
                    key={`build-task-${task.id}`}
                    secondaryAction={
                      task.status === 'success' && (
                        <IconButton
                          edge="end"
                          aria-label="flash"
                          onClick={() => {
                            onClickFlashFirmware(task);
                          }}
                        >
                          <DeveloperBoardIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemButton
                      onClick={() => {
                        onClickBuildingTask(task);
                      }}
                      selected={
                        selectedBuildingTask !== undefined &&
                        selectedBuildingTask.id === task.id
                      }
                    >
                      <ListItemAvatar>
                        {task.status === 'success' ? (
                          <CheckCircleIcon color="success" />
                        ) : task.status === 'failure' ? (
                          <ErrorIcon color="error" />
                        ) : task.status === 'waiting' ? (
                          <HourglassBottomIcon color="info" />
                        ) : (
                          <AutorenewIcon color="secondary" />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={`ID: ${task.id}`}
                        secondary={format(
                          task.updatedAt,
                          'yyyy-MM-dd HH:mm:ss'
                        )}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ flex: 10, display: 'flex', flexDirection: 'column' }}>
                <Tabs
                  value={selectedOutputTab}
                  onChange={(_, newValue) => setSelectedOutputTab(newValue)}
                >
                  <Tab label={t('Standard Output')} value={0} />
                  <Tab label={t('Standard Error')} value={1} />
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
                      fontFamily: 'monospace',
                    }}
                  >
                    {selectedBuildingTask !== undefined &&
                      (selectedOutputTab === 0
                        ? selectedBuildingTask.stdout
                        : selectedBuildingTask.stderr)}
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
        title={t('Confirm')}
        message={t('Are you sure you want to delete file?', {
          name: targetDeleteFile?.path,
        })}
        onClickYes={onClickDeleteFile}
        onClickNo={() => {
          setOpenConfirmDialog(false);
        }}
      />
      <FlashFirmwareDialog />
    </>
  );
}

type WorkbenchSourceCodeEditorProps = {
  project: IWorkbenchProject | undefined;
  file: IWorkbenchProjectFile | undefined;
  onChangeCode: (file: IWorkbenchProjectFile, code: string) => void;
};

function WorkbenchSourceCodeEditor(props: WorkbenchSourceCodeEditorProps) {
  const [code, setCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (props.project === undefined || props.file === undefined) {
      setCode(undefined);
      return;
    }
    setCode(props.file.code);
  }, [props.project, props.file]);

  const debounceCode = useDebounce(code, props.file, 1000);
  useEffect(() => {
    if (
      props.project === undefined ||
      props.file === undefined ||
      debounceCode.value === undefined
    ) {
      return;
    }
    if (debounceCode.base?.id !== props.file.id) {
      console.warn(
        'Debounce value base is not the same as current file. This should not happen.'
      );
      return;
    }
    props.onChangeCode(props.file, debounceCode.value);
  }, [debounceCode]);

  const onChangeCode = (value: string | undefined) => {
    if (
      props.project === undefined ||
      props.file === undefined ||
      value === undefined
    ) {
      return;
    }
    setCode(value);
  };

  if (props.project !== undefined && props.file !== undefined) {
    return (
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
    );
  } else {
    return null;
  }
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
