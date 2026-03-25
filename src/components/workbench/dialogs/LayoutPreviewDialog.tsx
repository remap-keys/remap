import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { t } from 'i18next';
import KeyModel from '../../../models/KeyModel';
import { KEY_SIZE } from '../../configure/keycap/Keycap';
import {
  parseQmkKeyboardJson,
  QmkLayoutKey,
  qmkLayoutKeyToKeyModel,
  getLayoutViewContent,
  LayoutViewContent,
} from '../../../services/workbench/QmkLayoutParser';
import './LayoutPreviewDialog.scss';

const BORDER = 1;
const MARGIN_W = 5;
const MARGIN_H = 5;
const ROOF_TOP = 3;
const GRID_SNAP = 0.125;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SNAP) * GRID_SNAP;
}

// Editor state tracked in undo/redo history
type EditorState = {
  positionOverrides: Record<number, { x: number; y: number }>;
  addedKeys: QmkLayoutKey[];
  deletedIndices: Set<number>;
};

function createEmptyState(): EditorState {
  return { positionOverrides: {}, addedKeys: [], deletedIndices: new Set() };
}

function cloneState(state: EditorState): EditorState {
  return {
    positionOverrides: { ...state.positionOverrides },
    addedKeys: [...state.addedKeys],
    deletedIndices: new Set(state.deletedIndices),
  };
}

type KeycapPreviewProps = {
  model: KeyModel;
  overrideX?: number;
  overrideY?: number;
  isDragging: boolean;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
};

function KeycapPreview({
  model,
  overrideX,
  overrideY,
  isDragging,
  isSelected,
  onMouseDown,
}: KeycapPreviewProps) {
  const width = model.width;
  const height = model.height;
  const top = overrideY !== undefined ? overrideY * KEY_SIZE : model.top;
  const left = overrideX !== undefined ? overrideX * KEY_SIZE : model.left;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    top,
    left,
    width,
    height,
    background: model.color,
  };

  const roofBaseStyle: React.CSSProperties = {
    position: 'absolute',
    width: width - (MARGIN_W + BORDER) * 2,
    height: height - (MARGIN_H + BORDER) * 2,
    top: top + ROOF_TOP,
    left: left + BORDER + MARGIN_W,
  };

  const roofStyle: React.CSSProperties = {
    position: 'absolute',
    width: width - (MARGIN_W + BORDER * 2) * 2,
    height: height - MARGIN_H * 2 - BORDER * 4,
    top: top + ROOF_TOP + BORDER,
    left: left + BORDER + MARGIN_W + BORDER,
  };

  return (
    <div
      className={[
        'layout-preview-key-base',
        isDragging && 'layout-preview-key-dragging',
        isSelected && 'layout-preview-key-selected',
      ]
        .filter(Boolean)
        .join(' ')}
      style={model.styleTransform}
      onMouseDown={onMouseDown}
    >
      <div className="layout-preview-key" style={baseStyle} />
      <div className="layout-preview-key-roof-base" style={roofBaseStyle} />
      <div className="layout-preview-key-roof" style={roofStyle}>
        <span className="layout-preview-key-label">{model.pos}</span>
      </div>
    </div>
  );
}

// Add Key Dialog
type AddKeyDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (row: number, col: number) => void;
  existingMatrixPositions: [number, number][];
  maxRow: number;
  maxCol: number;
};

function AddKeyDialog({
  open,
  onClose,
  onAdd,
  existingMatrixPositions,
  maxRow,
  maxCol,
}: AddKeyDialogProps) {
  const [row, setRow] = useState('');
  const [col, setCol] = useState('');

  useEffect(() => {
    if (open) {
      setRow('');
      setCol('');
    }
  }, [open]);

  const rowNum = Number(row);
  const colNum = Number(col);

  const isInputValid =
    row !== '' &&
    col !== '' &&
    !isNaN(rowNum) &&
    !isNaN(colNum) &&
    rowNum >= 0 &&
    rowNum <= maxRow &&
    colNum >= 0 &&
    colNum <= maxCol &&
    Number.isInteger(rowNum) &&
    Number.isInteger(colNum);

  const isDuplicate =
    isInputValid &&
    existingMatrixPositions.some(([r, c]) => r === rowNum && c === colNum);

  const isValid = isInputValid && !isDuplicate;

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd(rowNum, colNum);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{t('Add Key')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('Enter the matrix position for the new key.')}
        </Typography>
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <TextField
            label={`${t('Row')} (0-${maxRow})`}
            size="small"
            type="number"
            value={row}
            onChange={(e) => setRow(e.target.value)}
            inputProps={{ min: 0, max: maxRow }}
            sx={{ width: '50%' }}
            autoFocus
          />
          <TextField
            label={`${t('Column')} (0-${maxCol})`}
            size="small"
            type="number"
            value={col}
            onChange={(e) => setCol(e.target.value)}
            inputProps={{ min: 0, max: maxCol }}
            sx={{ width: '50%' }}
          />
        </div>
        {isDuplicate && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {t('A key with this matrix position already exists.')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} disabled={!isValid}>
          {t('Add')}
        </Button>
        <Button onClick={onClose}>{t('Cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
}

type KeyboardLayoutPanelProps = {
  keyboardJsonContent: string | null;
  onChange?: (updatedContent: string) => void;
};

export function KeyboardLayoutPanel(props: KeyboardLayoutPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastGeneratedCodeRef = useRef<string | null>(null);
  const [scale, setScale] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState('');

  // Editor state with undo/redo
  const [editorState, setEditorState] =
    useState<EditorState>(createEmptyState());
  const [history, setHistory] = useState<EditorState[]>([createEmptyState()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Selection & drag
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number | null>(null);
  const dragRef = useRef<{
    keyIndex: number;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [draggingKeyIndex, setDraggingKeyIndex] = useState<number | null>(null);

  // Add key dialog
  const [openAddKeyDialog, setOpenAddKeyDialog] = useState(false);

  const parseResult = useMemo(() => {
    if (!props.keyboardJsonContent) return { parsed: null, error: false };
    try {
      return {
        parsed: parseQmkKeyboardJson(props.keyboardJsonContent),
        error: false,
      };
    } catch {
      return { parsed: null, error: true };
    }
  }, [props.keyboardJsonContent]);

  const parsed = parseResult.parsed;

  useEffect(() => {
    if (parsed && parsed.layoutNames.length > 0) {
      setSelectedLayout(parsed.layoutNames[0]);
    } else {
      setSelectedLayout('');
    }
  }, [parsed]);

  const originalKeyModels: KeyModel[] = useMemo(() => {
    if (!parsed || !selectedLayout) return [];
    try {
      return parsed.getKeyModels(selectedLayout);
    } catch {
      return [];
    }
  }, [parsed, selectedLayout]);

  // Reset editor state when layout changes
  useEffect(() => {
    const empty = createEmptyState();
    setEditorState(empty);
    setHistory([empty]);
    setHistoryIndex(0);
    setSelectedKeyIndex(null);
  }, [originalKeyModels]);

  // Build visible keys: original (minus deleted) + added
  const allKeyModels: KeyModel[] = useMemo(() => {
    const addedModels = editorState.addedKeys.map(qmkLayoutKeyToKeyModel);
    return [...originalKeyModels, ...addedModels];
  }, [originalKeyModels, editorState.addedKeys]);

  const visibleKeyEntries: { model: KeyModel; index: number }[] =
    useMemo(() => {
      return allKeyModels
        .map((model, index) => ({ model, index }))
        .filter(({ index }) => !editorState.deletedIndices.has(index));
    }, [allKeyModels, editorState.deletedIndices]);

  // Compute layout view content from visible keys with overrides applied
  const layoutContent: LayoutViewContent | null = useMemo(() => {
    if (visibleKeyEntries.length === 0) return null;
    const models = visibleKeyEntries.map(({ model, index }) => {
      const override = editorState.positionOverrides[index];
      if (override) {
        return qmkLayoutKeyToKeyModel({
          matrix: [0, 0], // dummy, not used for display
          x: override.x,
          y: override.y,
          w: model.w,
          h: model.h,
        });
      }
      return model;
    });
    return getLayoutViewContent(models);
  }, [visibleKeyEntries, editorState.positionOverrides]);

  // Compute scale
  useEffect(() => {
    if (!layoutContent || !containerRef.current) {
      setScale(1);
      return;
    }
    const containerWidth = containerRef.current.clientWidth;
    const keyboardWidth = layoutContent.width + 26;
    if (containerWidth > 0 && keyboardWidth > containerWidth) {
      setScale(containerWidth / keyboardWidth);
    } else {
      setScale(1);
    }
  }, [layoutContent]);

  // Commit current editor state to history
  const commitToHistory = useCallback(
    (newState: EditorState) => {
      setHistory((prev) => {
        const truncated = prev.slice(0, historyIndex + 1);
        truncated.push(cloneState(newState));
        setHistoryIndex(truncated.length - 1);
        return truncated;
      });
    },
    [historyIndex]
  );

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, index: number, model: KeyModel) => {
      e.preventDefault();
      setSelectedKeyIndex(index);
      const override = editorState.positionOverrides[index];
      dragRef.current = {
        keyIndex: index,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: override?.x ?? model.x,
        startY: override?.y ?? model.y,
      };
      setDraggingKeyIndex(index);
    },
    [editorState.positionOverrides]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { keyIndex, startMouseX, startMouseY, startX, startY } =
        dragRef.current;
      const dx = (e.clientX - startMouseX) / (KEY_SIZE * scale);
      const dy = (e.clientY - startMouseY) / (KEY_SIZE * scale);
      const newX = Math.max(0, snapToGrid(startX + dx));
      const newY = Math.max(0, snapToGrid(startY + dy));
      setEditorState((prev) => ({
        ...prev,
        positionOverrides: {
          ...prev.positionOverrides,
          [keyIndex]: { x: newX, y: newY },
        },
      }));
    };

    const handleMouseUp = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      setDraggingKeyIndex(null);
      setEditorState((current) => {
        commitToHistory(current);
        return current;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [scale, commitToHistory]);

  // Undo / Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setEditorState(cloneState(history[newIndex]));
    setSelectedKeyIndex(null);
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setEditorState(cloneState(history[newIndex]));
    setSelectedKeyIndex(null);
  }, [canRedo, historyIndex, history]);

  // Add key
  const handleAddKey = useCallback(
    (row: number, col: number) => {
      setEditorState((prev) => {
        const newState: EditorState = {
          ...prev,
          addedKeys: [...prev.addedKeys, { matrix: [row, col], x: 0, y: 0 }],
        };
        commitToHistory(newState);
        return newState;
      });
    },
    [commitToHistory]
  );

  // Delete selected key
  const handleDeleteKey = useCallback(() => {
    if (selectedKeyIndex === null) return;
    setEditorState((prev) => {
      const newDeleted = new Set(prev.deletedIndices);
      newDeleted.add(selectedKeyIndex);
      const newState: EditorState = {
        ...prev,
        deletedIndices: newDeleted,
      };
      commitToHistory(newState);
      return newState;
    });
    setSelectedKeyIndex(null);
  }, [selectedKeyIndex, commitToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'y' || (e.key === 'z' && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (
          !(e.target instanceof HTMLInputElement) &&
          !(e.target instanceof HTMLTextAreaElement)
        ) {
          e.preventDefault();
          handleDeleteKey();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleDeleteKey]);

  // Check if there are any changes
  const hasChanges =
    Object.keys(editorState.positionOverrides).length > 0 ||
    editorState.addedKeys.length > 0 ||
    editorState.deletedIndices.size > 0;

  // Build JSON from current editor state
  const buildJson = useCallback((): string | null => {
    if (!props.keyboardJsonContent || !selectedLayout) return null;
    try {
      const json = JSON.parse(props.keyboardJsonContent);
      const layoutKeys: QmkLayoutKey[] =
        json.layouts?.[selectedLayout]?.layout ?? [];

      // Apply position overrides to original keys
      for (const [indexStr, override] of Object.entries(
        editorState.positionOverrides
      )) {
        const index = Number(indexStr);
        if (index >= 0 && index < layoutKeys.length) {
          layoutKeys[index].x = override.x;
          layoutKeys[index].y = override.y;
        }
      }

      // Remove deleted keys (in reverse order to preserve indices)
      const sortedDeleted = [...editorState.deletedIndices].sort(
        (a, b) => b - a
      );
      for (const index of sortedDeleted) {
        if (index < layoutKeys.length) {
          layoutKeys.splice(index, 1);
        }
      }

      // Add new keys (with position overrides if dragged)
      editorState.addedKeys.forEach((key, i) => {
        const addedIndex = originalKeyModels.length + i;
        const override = editorState.positionOverrides[addedIndex];
        layoutKeys.push({
          ...key,
          x: override?.x ?? key.x,
          y: override?.y ?? key.y,
        });
      });

      json.layouts[selectedLayout].layout = layoutKeys;
      return JSON.stringify(json, null, 2);
    } catch {
      return null;
    }
  }, [
    props.keyboardJsonContent,
    selectedLayout,
    editorState,
    originalKeyModels.length,
  ]);

  // Auto-apply layout changes with debounce
  useEffect(() => {
    if (!props.onChange || !hasChanges) return;
    const timer = setTimeout(() => {
      const updated = buildJson();
      if (updated !== null && updated !== props.keyboardJsonContent) {
        lastGeneratedCodeRef.current = updated;
        props.onChange?.(updated);
        const empty = createEmptyState();
        setEditorState(empty);
        setHistory([empty]);
        setHistoryIndex(0);
        setSelectedKeyIndex(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [buildJson, hasChanges]);

  const hasLayouts = parsed !== null && parsed.layoutNames.length > 0;
  const hasMultipleLayouts = parsed !== null && parsed.layoutNames.length > 1;

  if (parseResult.error || !props.keyboardJsonContent) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          gap: 8,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          {t('Could not parse keyboard.json.')}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('Please use the Code Editor to fix syntax errors.')}
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 8px',
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0,
        }}
      >
        {hasLayouts && (
          <>
            <Tooltip title={`${t('Undo')} (Ctrl+Z)`}>
              <span>
                <IconButton size="small" onClick={undo} disabled={!canUndo}>
                  <UndoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={`${t('Redo')} (Ctrl+Shift+Z)`}>
              <span>
                <IconButton size="small" onClick={redo} disabled={!canRedo}>
                  <RedoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('Add Key')}>
              <IconButton
                size="small"
                onClick={() => setOpenAddKeyDialog(true)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={`${t('Delete Key')} (Delete)`}>
              <span>
                <IconButton
                  size="small"
                  onClick={handleDeleteKey}
                  disabled={selectedKeyIndex === null}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            {hasMultipleLayouts && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>{t('Select Layout')}</InputLabel>
                <Select
                  value={selectedLayout}
                  label={t('Select Layout')}
                  onChange={(e) => setSelectedLayout(e.target.value)}
                >
                  {parsed!.layoutNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        {!hasLayouts && (
          <Typography color="text.secondary">
            {t('No layouts found in keyboard.json.')}
          </Typography>
        )}
        {hasLayouts && (
          <div className="layout-preview-container" ref={containerRef}>
            {layoutContent && (
              <div
                className="layout-preview-keyboard-root"
                style={{
                  width: layoutContent.width + 16,
                  height: layoutContent.height + 16,
                  transform: `scale(${scale})`,
                }}
              >
                <div
                  className="layout-preview-keyboard-frame"
                  style={{
                    width: layoutContent.width,
                    height: layoutContent.height,
                    left: -layoutContent.left,
                    top: -layoutContent.top,
                  }}
                >
                  {visibleKeyEntries.map(({ model, index }) => {
                    const override = editorState.positionOverrides[index];
                    return (
                      <KeycapPreview
                        key={`key-${index}`}
                        model={model}
                        overrideX={override?.x}
                        overrideY={override?.y}
                        isDragging={draggingKeyIndex === index}
                        isSelected={selectedKeyIndex === index}
                        onMouseDown={(e) => handleMouseDown(e, index, model)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <AddKeyDialog
        open={openAddKeyDialog}
        onClose={() => setOpenAddKeyDialog(false)}
        onAdd={handleAddKey}
        existingMatrixPositions={visibleKeyEntries.map(({ model }) => {
          const parts = model.pos.split(',').map(Number);
          return [parts[0], parts[1]] as [number, number];
        })}
        maxRow={
          originalKeyModels.reduce((max, m) => {
            const row = Number(m.pos.split(',')[0]);
            return isNaN(row) ? max : Math.max(max, row);
          }, 0) + 1
        }
        maxCol={
          originalKeyModels.reduce((max, m) => {
            const col = Number(m.pos.split(',')[1]);
            return isNaN(col) ? max : Math.max(max, col);
          }, 0) + 1
        }
      />
    </div>
  );
}

type LayoutPreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  keyboardJsonContent: string | null;
  onApply?: (updatedContent: string) => void;
};

export default function LayoutPreviewDialog(props: LayoutPreviewDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('Layout Editor')}</DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        <KeyboardLayoutPanel
          keyboardJsonContent={props.keyboardJsonContent}
          onChange={(updatedContent) => {
            props.onApply?.(updatedContent);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
