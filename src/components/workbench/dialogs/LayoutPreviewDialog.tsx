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

// Editor state for tracking layout changes
type EditorState = {
  positionOverrides: Record<number, { x: number; y: number }>;
  matrixOverrides: Record<number, { row: number; col: number }>;
  addedKeys: QmkLayoutKey[];
  deletedIndices: Set<number>;
};

function createEmptyState(): EditorState {
  return {
    positionOverrides: {},
    matrixOverrides: {},
    addedKeys: [],
    deletedIndices: new Set(),
  };
}

type KeycapPreviewProps = {
  model: KeyModel;
  layoutIndex: number;
  overrideX?: number;
  overrideY?: number;
  matrixRow: number;
  matrixCol: number;
  isDragging: boolean;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMatrixStep?: (dRow: number, dCol: number) => void;
};

function KeycapPreview({
  model,
  layoutIndex,
  overrideX,
  overrideY,
  matrixRow,
  matrixCol,
  isDragging,
  isSelected,
  onMouseDown,
  onMatrixStep,
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

  const handleMatrixButton = (
    e: React.MouseEvent,
    dRow: number,
    dCol: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onMatrixStep?.(dRow, dCol);
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
        <span className="layout-preview-index-badge">{layoutIndex}</span>
        {isSelected && onMatrixStep ? (
          <div className="layout-preview-matrix-editor">
            <div className="layout-preview-matrix-arrows">
              <button
                className="layout-preview-matrix-btn"
                onMouseDown={(e) => handleMatrixButton(e, -1, 0)}
              >
                ▲
              </button>
              <button
                className="layout-preview-matrix-btn"
                onMouseDown={(e) => handleMatrixButton(e, 0, -1)}
              >
                ◀
              </button>
              <span className="layout-preview-matrix-label">
                {matrixRow},{matrixCol}
              </span>
              <button
                className="layout-preview-matrix-btn"
                onMouseDown={(e) => handleMatrixButton(e, 0, 1)}
              >
                ▶
              </button>
              <button
                className="layout-preview-matrix-btn"
                onMouseDown={(e) => handleMatrixButton(e, 1, 0)}
              >
                ▼
              </button>
            </div>
          </div>
        ) : (
          <span className="layout-preview-key-label">
            {matrixRow},{matrixCol}
          </span>
        )}
      </div>
    </div>
  );
}

// Add Key Dialog
type AddKeyDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (index: number, row: number, col: number) => void;
  existingMatrixPositions: [number, number][];
  keyCount: number;
  defaultRow: number;
  defaultCol: number;
};

function AddKeyDialog({
  open,
  onClose,
  onAdd,
  existingMatrixPositions,
  keyCount,
  defaultRow,
  defaultCol,
}: AddKeyDialogProps) {
  const [index, setIndex] = useState('');
  const [row, setRow] = useState('');
  const [col, setCol] = useState('');

  useEffect(() => {
    if (open) {
      setIndex(String(keyCount));
      setRow(String(defaultRow));
      setCol(String(defaultCol));
    }
  }, [open, keyCount, defaultRow, defaultCol]);

  const indexNum = Number(index);
  const rowNum = Number(row);
  const colNum = Number(col);

  const isInputValid =
    index !== '' &&
    row !== '' &&
    col !== '' &&
    !isNaN(indexNum) &&
    !isNaN(rowNum) &&
    !isNaN(colNum) &&
    indexNum >= 0 &&
    indexNum <= keyCount &&
    rowNum >= 0 &&
    colNum >= 0 &&
    Number.isInteger(indexNum) &&
    Number.isInteger(rowNum) &&
    Number.isInteger(colNum);

  const isDuplicate =
    isInputValid &&
    existingMatrixPositions.some(([r, c]) => r === rowNum && c === colNum);

  const isValid = isInputValid && !isDuplicate;

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd(indexNum, rowNum, colNum);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{t('Add Key')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('Enter the index and matrix position for the new key.')}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TextField
            label={`${t('Index')} (0-${keyCount})`}
            size="small"
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            inputProps={{ min: 0, max: keyCount }}
            fullWidth
            autoFocus
            helperText={t(
              'Position in the layout array. Existing keys at this index and after will shift.'
            )}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <TextField
              label={t('Row')}
              size="small"
              type="number"
              value={row}
              onChange={(e) => setRow(e.target.value)}
              inputProps={{ min: 0 }}
              sx={{ flex: 1 }}
            />
            <TextField
              label={t('Column')}
              size="small"
              type="number"
              value={col}
              onChange={(e) => setCol(e.target.value)}
              inputProps={{ min: 0 }}
              sx={{ flex: 1 }}
            />
          </div>
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

  // Editor state
  const [editorState, setEditorState] =
    useState<EditorState>(createEmptyState());

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

  // Original layout keys (for matrix position data)
  const originalLayoutKeys: QmkLayoutKey[] = useMemo(() => {
    if (!parsed || !selectedLayout) return [];
    try {
      return parsed.getLayoutKeys(selectedLayout);
    } catch {
      return [];
    }
  }, [parsed, selectedLayout]);

  // Reset editor state when layout changes (but not from auto-apply)
  useEffect(() => {
    setEditorState(createEmptyState());
    // Only clear selection for external changes (not auto-apply)
    if (props.keyboardJsonContent !== lastGeneratedCodeRef.current) {
      setSelectedKeyIndex(null);
    }
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
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [scale]);

  // Add key at a specific index (insert into layout array)
  const handleAddKey = useCallback(
    (index: number, row: number, col: number) => {
      if (!props.keyboardJsonContent || !props.onChange || !selectedLayout)
        return;
      try {
        const json = JSON.parse(props.keyboardJsonContent);
        const layoutKeys: QmkLayoutKey[] =
          json.layouts?.[selectedLayout]?.layout ?? [];
        const newKey: QmkLayoutKey = { matrix: [row, col], x: 0, y: 0 };
        layoutKeys.splice(index, 0, newKey);
        json.layouts[selectedLayout].layout = layoutKeys;
        const updated = JSON.stringify(json, null, 2);
        lastGeneratedCodeRef.current = updated;
        props.onChange(updated);
      } catch {
        // Invalid JSON
      }
    },
    [props.keyboardJsonContent, props.onChange, selectedLayout]
  );

  // Delete selected key
  const handleDeleteKey = useCallback(() => {
    if (selectedKeyIndex === null) return;
    setEditorState((prev) => {
      const newDeleted = new Set(prev.deletedIndices);
      newDeleted.add(selectedKeyIndex);
      return {
        ...prev,
        deletedIndices: newDeleted,
      };
    });
    setSelectedKeyIndex(null);
  }, [selectedKeyIndex]);

  // Step matrix position to the nearest available slot in the given direction
  const handleMatrixStep = useCallback(
    (keyIndex: number, dRow: number, dCol: number) => {
      setEditorState((prev) => {
        const allKeys = [...originalLayoutKeys, ...prev.addedKeys];

        // Get current matrix position of this key
        const curOverride = prev.matrixOverrides[keyIndex];
        const curRow = curOverride?.row ?? allKeys[keyIndex]?.matrix[0] ?? 0;
        const curCol = curOverride?.col ?? allKeys[keyIndex]?.matrix[1] ?? 0;

        // Collect all occupied positions (excluding this key and deleted keys)
        const occupied = new Set<string>();
        for (let i = 0; i < allKeys.length; i++) {
          if (i === keyIndex || prev.deletedIndices.has(i)) continue;
          const ov = prev.matrixOverrides[i];
          const r = ov?.row ?? allKeys[i].matrix[0];
          const c = ov?.col ?? allKeys[i].matrix[1];
          occupied.add(`${r},${c}`);
        }

        let newRow = curRow;
        let newCol = curCol;

        const MAX_MATRIX = 100;
        if (dCol !== 0) {
          // Horizontal: find nearest available col in same row
          for (
            let c = curCol + dCol;
            dCol > 0 ? c <= MAX_MATRIX : c >= 0;
            c += dCol
          ) {
            if (!occupied.has(`${curRow},${c}`)) {
              newCol = c;
              break;
            }
          }
        } else if (dRow !== 0) {
          // Vertical: find nearest available row in same col
          for (
            let r = curRow + dRow;
            dRow > 0 ? r <= MAX_MATRIX : r >= 0;
            r += dRow
          ) {
            if (!occupied.has(`${r},${curCol}`)) {
              newRow = r;
              break;
            }
          }
        }

        if (newRow === curRow && newCol === curCol) {
          return prev; // No available slot found
        }

        return {
          ...prev,
          matrixOverrides: {
            ...prev.matrixOverrides,
            [keyIndex]: { row: newRow, col: newCol },
          },
        };
      });
    },
    [originalLayoutKeys]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
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
  }, [handleDeleteKey]);

  // Check if there are any changes
  const hasChanges =
    Object.keys(editorState.positionOverrides).length > 0 ||
    Object.keys(editorState.matrixOverrides).length > 0 ||
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

      // Apply matrix overrides to original keys
      for (const [indexStr, override] of Object.entries(
        editorState.matrixOverrides
      )) {
        const index = Number(indexStr);
        if (index >= 0 && index < layoutKeys.length) {
          layoutKeys[index].matrix = [override.row, override.col];
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
        setEditorState(createEmptyState());
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
                  {visibleKeyEntries.map(({ model, index }, visibleIndex) => {
                    const override = editorState.positionOverrides[index];
                    const matrixOverride = editorState.matrixOverrides[index];
                    // Get matrix from: override > addedKeys > originalLayoutKeys
                    const isAddedKey = index >= originalLayoutKeys.length;
                    const baseMatrix = isAddedKey
                      ? editorState.addedKeys[index - originalLayoutKeys.length]
                          ?.matrix
                      : originalLayoutKeys[index]?.matrix;
                    const matrixRow =
                      matrixOverride?.row ?? baseMatrix?.[0] ?? 0;
                    const matrixCol =
                      matrixOverride?.col ?? baseMatrix?.[1] ?? 0;
                    return (
                      <KeycapPreview
                        key={`key-${index}`}
                        model={model}
                        layoutIndex={visibleIndex}
                        overrideX={override?.x}
                        overrideY={override?.y}
                        matrixRow={matrixRow}
                        matrixCol={matrixCol}
                        isDragging={draggingKeyIndex === index}
                        isSelected={selectedKeyIndex === index}
                        onMouseDown={(e) => handleMouseDown(e, index, model)}
                        onMatrixStep={(dRow, dCol) =>
                          handleMatrixStep(index, dRow, dCol)
                        }
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
        keyCount={visibleKeyEntries.length}
        defaultRow={
          originalKeyModels.reduce((max, m) => {
            const row = Number(m.pos.split(',')[0]);
            return isNaN(row) ? max : Math.max(max, row);
          }, 0) + 1
        }
        defaultCol={
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
