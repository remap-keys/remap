import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
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
import { KeyboardLayoutPanel } from '../dialogs/LayoutPreviewDialog';
import { KeyboardJsonSettingsPanel } from '../dialogs/KeyboardJsonEditorDialog';
import { ConfigHSettingsPanel } from '../dialogs/ConfigHSettingsPanel';
import VisualKeymapEditor from '../visualeditor/VisualKeymapEditor';

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
  const [editorFontSize, setEditorFontSize] = useState<number>(14);

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
              <EditorWithVisualTab
                project={props.currentProject}
                selectedFile={props.selectedFile}
                onChangeCode={onChangeCode}
                onUpdateFile={props.updateWorkbenchProjectFile!}
                editorFontSize={editorFontSize}
                onFontSizeChange={setEditorFontSize}
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

type EditorWithVisualTabProps = {
  project: IWorkbenchProject | undefined;
  selectedFile:
    | { fileId: string; fileType: IBuildableFirmwareFileType }
    | undefined;
  onChangeCode: (file: IWorkbenchProjectFile, code: string) => void;
  // eslint-disable-next-line no-unused-vars
  onUpdateFile: (
    project: IWorkbenchProject,
    file: IWorkbenchProjectFile,
    path: string,
    code: string,
    refreshCurrentProject: boolean
  ) => void;
  editorFontSize: number;
  onFontSizeChange: (size: number) => void;
};

function EditorWithVisualTab(props: EditorWithVisualTabProps) {
  const [editorTab, setEditorTab] = useState(0);
  // Snapshot of the Code Editor content at the moment of tab switch.
  // This ensures Form Editor / Key Layout always receive the latest code
  // even if the Code Editor's debounce hasn't flushed to Redux yet.
  const [codeSnapshot, setCodeSnapshot] = useState<string | null>(null);
  const pendingCodeRef = useRef<string | undefined>(undefined);

  const file = useMemo(() => {
    if (props.project === undefined || props.selectedFile === undefined) {
      return undefined;
    }
    return props.selectedFile.fileType === 'keyboard'
      ? props.project.keyboardFiles.find(
          (f) => f.id === props.selectedFile!.fileId
        )
      : props.project.keymapFiles.find(
          (f) => f.id === props.selectedFile!.fileId
        );
  }, [props.project, props.selectedFile]);

  const isKeymapCFile =
    props.selectedFile?.fileType === 'keymap' && file?.path?.endsWith('.c');

  const isKeyboardJsonFile =
    props.selectedFile?.fileType === 'keyboard' &&
    file?.path === 'keyboard.json';

  const isConfigHFile =
    props.selectedFile?.fileType === 'keyboard' && file?.path === 'config.h';

  const hasTabs = isKeymapCFile || isKeyboardJsonFile || isConfigHFile;

  const keyboardJsonCode = useMemo(() => {
    if (!props.project) return undefined;
    const kbFile = props.project.keyboardFiles.find(
      (f) => f.path === 'keyboard.json'
    );
    return kbFile?.code;
  }, [props.project]);

  // Reset to Code Editor tab when file changes or is not a tabbed file
  useEffect(() => {
    setEditorTab(0);
    pendingCodeRef.current = undefined;
    setCodeSnapshot(null);
  }, [file?.id]);

  // Called by WorkbenchSourceCodeEditor on every keystroke (not debounced)
  const handleImmediateCodeChange = useCallback((code: string) => {
    pendingCodeRef.current = code;
  }, []);

  const handleTabChange = useCallback((_: unknown, newValue: number) => {
    if (newValue !== 0) {
      // Switching to a non-Code-Editor tab: capture latest code as snapshot
      // so that Form Editor / Key Layout receive the most up-to-date content
      // even if the Code Editor's debounce hasn't flushed to Redux yet.
      const pending = pendingCodeRef.current;
      if (pending !== undefined) {
        setCodeSnapshot(pending);
      } else {
        setCodeSnapshot(null);
      }
    }
    setEditorTab(newValue);
  }, []);

  // The code to pass to non-Code-Editor tabs.
  // Prefer the snapshot (captured on tab switch) over file.code from Redux.
  const effectiveCode = codeSnapshot ?? file?.code ?? null;

  const handleVisualEditorCodeChange = useCallback(
    (code: string) => {
      if (file && props.project) {
        // Update the file with refreshCurrentProject=true so the Redux state
        // reflects the change immediately (needed for Code Editor tab sync).
        props.onUpdateFile(props.project, file, file.path, code, true);
        // Also update the snapshot so that switching between non-Code tabs
        // reflects the latest changes.
        setCodeSnapshot(code);
      }
    },
    [file, props.project, props.onUpdateFile]
  );

  const fontSizeControls = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: 1 }}>
      <IconButton
        size="small"
        onClick={() =>
          props.onFontSizeChange(Math.max(8, props.editorFontSize - 2))
        }
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          A-
        </Typography>
      </IconButton>
      <Typography variant="caption" color="text.secondary">
        {props.editorFontSize}px
      </Typography>
      <IconButton
        size="small"
        onClick={() =>
          props.onFontSizeChange(Math.min(32, props.editorFontSize + 2))
        }
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          A+
        </Typography>
      </IconButton>
    </Box>
  );

  return (
    <>
      {hasTabs && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={editorTab}
            onChange={handleTabChange}
            sx={{ minHeight: 32, flexGrow: 1 }}
          >
            <Tab
              label={t('Code Editor')}
              sx={{ minHeight: 32, py: 0.5, textTransform: 'none' }}
            />
            {isKeymapCFile && (
              <Tab
                label={t('Visual Editor')}
                sx={{ minHeight: 32, py: 0.5, textTransform: 'none' }}
              />
            )}
            {isKeyboardJsonFile && (
              <Tab
                label={t('Form Editor')}
                sx={{ minHeight: 32, py: 0.5, textTransform: 'none' }}
              />
            )}
            {isKeyboardJsonFile && (
              <Tab
                label={t('Key Layout')}
                sx={{ minHeight: 32, py: 0.5, textTransform: 'none' }}
              />
            )}
            {isConfigHFile && (
              <Tab
                label={t('Form Editor')}
                sx={{ minHeight: 32, py: 0.5, textTransform: 'none' }}
              />
            )}
          </Tabs>
          {editorTab === 0 && fontSizeControls}
        </Box>
      )}
      <div
        style={{
          display: editorTab === 0 || !hasTabs ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <WorkbenchSourceCodeEditor
          project={props.project}
          file={file}
          onChangeCode={props.onChangeCode}
          onImmediateChange={handleImmediateCodeChange}
          fontSize={props.editorFontSize}
          onFontSizeChange={props.onFontSizeChange}
          showFontSizeControls={!hasTabs}
        />
      </div>
      {isKeymapCFile && editorTab === 1 && file && (
        <VisualKeymapEditor
          keymapCode={file.code}
          keyboardJsonCode={keyboardJsonCode}
          onChangeCode={handleVisualEditorCodeChange}
        />
      )}
      {isKeyboardJsonFile && editorTab === 1 && (
        <KeyboardJsonSettingsPanel
          keyboardJsonContent={effectiveCode}
          onChange={handleVisualEditorCodeChange}
        />
      )}
      {isKeyboardJsonFile && editorTab === 2 && (
        <KeyboardLayoutPanel
          keyboardJsonContent={effectiveCode}
          onChange={handleVisualEditorCodeChange}
        />
      )}
      {isConfigHFile && editorTab === 1 && (
        <ConfigHSettingsPanel
          configHContent={effectiveCode}
          onChange={handleVisualEditorCodeChange}
        />
      )}
    </>
  );
}

type WorkbenchSourceCodeEditorProps = {
  project: IWorkbenchProject | undefined;
  file: IWorkbenchProjectFile | undefined;
  onChangeCode: (file: IWorkbenchProjectFile, code: string) => void;
  onImmediateChange?: (code: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  showFontSizeControls?: boolean;
};

function WorkbenchSourceCodeEditor(props: WorkbenchSourceCodeEditorProps) {
  const [code, setCode] = useState<string | undefined>(undefined);
  const currentFileRef = useRef<string | undefined>(undefined);
  const lastPropCodeRef = useRef<string | undefined>(undefined);
  // Refs for flush-on-unmount: track latest code and stable callback reference
  const latestCodeRef = useRef<string | undefined>(undefined);
  const onChangeCodeRef = useRef(props.onChangeCode);
  const fileRef = useRef(props.file);
  onChangeCodeRef.current = props.onChangeCode;
  fileRef.current = props.file;

  useEffect(() => {
    if (props.project === undefined || props.file === undefined) {
      setCode(undefined);
      currentFileRef.current = undefined;
      lastPropCodeRef.current = undefined;
      return;
    }
    if (currentFileRef.current !== props.file.id) {
      // Different file selected
      setCode(props.file.code);
      currentFileRef.current = props.file.id;
      lastPropCodeRef.current = props.file.code;
      latestCodeRef.current = props.file.code;
      props.onImmediateChange?.(props.file.code);
    } else if (lastPropCodeRef.current !== props.file.code) {
      // Same file, but code changed externally (e.g. from layout editor or JSON editor)
      setCode(props.file.code);
      lastPropCodeRef.current = props.file.code;
      latestCodeRef.current = props.file.code;
      props.onImmediateChange?.(props.file.code);
    }
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
    // Skip if the debounced value is the same as the current file content
    // (e.g. after an external update from layout editor or JSON editor)
    if (debounceCode.value === props.file.code) {
      return;
    }
    props.onChangeCode(props.file, debounceCode.value);
  }, [debounceCode]);

  // Flush unsaved code on unmount to prevent data loss on tab switch
  useEffect(() => {
    return () => {
      if (
        latestCodeRef.current !== undefined &&
        fileRef.current !== undefined &&
        latestCodeRef.current !== fileRef.current.code
      ) {
        onChangeCodeRef.current(fileRef.current, latestCodeRef.current);
      }
    };
  }, []);

  const onChangeCode = (value: string | undefined) => {
    if (
      props.project === undefined ||
      props.file === undefined ||
      value === undefined
    ) {
      return;
    }
    setCode(value);
    latestCodeRef.current = value;
    props.onImmediateChange?.(value);
  };

  const getLanguage = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'json':
        return 'json';
      case 'c':
      case 'h':
        return 'c';
      case 'mk':
        return 'makefile';
      default:
        return 'plaintext';
    }
  };

  if (props.project !== undefined && props.file !== undefined) {
    const showControls = props.showFontSizeControls !== false;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {showControls && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '2px 8px',
              gap: 4,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <IconButton
              size="small"
              onClick={() =>
                props.onFontSizeChange(Math.max(8, props.fontSize - 2))
              }
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                A-
              </Typography>
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {props.fontSize}px
            </Typography>
            <IconButton
              size="small"
              onClick={() =>
                props.onFontSizeChange(Math.min(32, props.fontSize + 2))
              }
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                A+
              </Typography>
            </IconButton>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <Editor
            language={getLanguage(props.file.path)}
            height="100%"
            value={code}
            options={{
              minimap: { enabled: false },
              wordWrap: 'off',
              automaticLayout: true,
              renderWhitespace: 'all',
              fontSize: props.fontSize,
            }}
            onChange={onChangeCode}
          />
        </div>
      </div>
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
