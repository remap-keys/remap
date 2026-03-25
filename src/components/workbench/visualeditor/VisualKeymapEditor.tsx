import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import {
  parseQmkKeyboardJson,
  getLayoutViewContent,
} from '../../../services/workbench/QmkLayoutParser';
import {
  parseKeymapC,
  ParsedKeymap,
} from '../../../services/workbench/KeymapCParser';
import { generateKeymapC } from '../../../services/workbench/KeymapCGenerator';
import {
  nameToCode,
  codeToName,
} from '../../../services/workbench/QmkKeycodeMapper';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import { genKey, Key } from '../../common/keycodekey/KeyGen';
import { buildHoldKeyLabel } from '../../common/customkey/TabHoldTapKey';
import { buildModLabel } from '../../common/customkey/Modifiers';
import CustomKey, {
  CUSTOMKEY_POPOVER_HEIGHT,
  CUSTOMKEY_POPOVER_TRIANGLE,
  CUSTOMKEY_POPOVER_WIDTH,
  PopoverPosition,
} from '../../common/customkey/CustomKey';
import VisualKeycap from './VisualKeycap';
import LayerSelector from './LayerSelector';
import './VisualKeymapEditor.scss';

type VisualKeymapEditorProps = {
  keymapCode: string;
  keyboardJsonCode: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChangeCode: (code: string) => void;
};

type KeycapLabel = {
  label: string;
  meta: string;
  isCustom: boolean;
};

/**
 * Convert a keycode name to display labels for keycap rendering.
 * Uses genKey() to produce labels consistent with the Configure domain.
 */
function resolveKeycapLabel(keycodeName: string): KeycapLabel {
  if (keycodeName === '_______') return { label: '▽', meta: '', isCustom: false };
  if (keycodeName === 'XXXXXXX') return { label: '', meta: '', isCustom: false };
  try {
    const code = nameToCode(keycodeName);
    if (code === null) return { label: keycodeName, meta: '', isCustom: true };
    const keymap = KeycodeList.getKeymap(code, 'en-us', undefined);
    const key = genKey(keymap, 'en-us');

    // For hold/tap keycodes, show hold function as meta label
    const km = key.keymap;
    const holdLabel = buildHoldKeyLabel(km, km.isAny);
    let meta = key.meta;
    if (!meta && holdLabel) {
      meta = holdLabel;
    } else if (!meta) {
      const modLabel = buildModLabel(km.modifiers || null, km.direction!);
      if (modLabel) {
        meta = modLabel;
      }
    }

    return { label: key.label, meta, isCustom: false };
  } catch {
    return { label: keycodeName, meta: '', isCustom: true };
  }
}

/**
 * Safely get an IKeymap and Key for a given keycode name.
 * Returns null if the keycode cannot be resolved.
 */
function resolveKeyForPopover(keycodeName: string): Key | null {
  try {
    const code = nameToCode(keycodeName);
    if (code === null) return null;
    const { value, holdKey, tapKey } = KeycodeList.getKeymaps(
      code,
      'en-us',
      undefined
    );
    // Use the value keymap if available, otherwise construct from holdKey
    let keymap;
    if (value) {
      keymap = value;
    } else if (holdKey && tapKey) {
      // For composite keycodes (LT, MT, etc.), use holdKey with tapKey's keycodeInfo
      keymap = {
        ...holdKey,
        code,
        keycodeInfo: tapKey.keycodeInfo ?? holdKey.keycodeInfo,
      };
    } else {
      // Fallback to anyKeymap
      keymap = KeycodeList.getKeymap(code, 'en-us', undefined);
    }
    if (!keymap || !keymap.keycodeInfo) return null;
    return genKey(keymap, 'en-us');
  } catch {
    return null;
  }
}

/**
 * Calculate the popover position relative to a clicked element,
 * following the same 4-direction logic as Configure's Keymap.tsx.
 */
function calculatePopoverPosition(
  target: HTMLElement
): PopoverPosition {
  const rect = target.getBoundingClientRect();
  const { left, top, right, height, width } = rect;
  const center = left + width / 2;
  const maxTop = top - CUSTOMKEY_POPOVER_HEIGHT;
  const maxBottom =
    top + height + CUSTOMKEY_POPOVER_TRIANGLE + CUSTOMKEY_POPOVER_HEIGHT;
  const isThin = maxTop < 0 && window.innerHeight < maxBottom;
  const isLeftSideKey = center < window.innerWidth / 2;

  if (left < 200 || (isThin && isLeftSideKey)) {
    return {
      left: left + width + CUSTOMKEY_POPOVER_TRIANGLE / 2,
      top:
        top +
        height / 2 +
        CUSTOMKEY_POPOVER_TRIANGLE -
        CUSTOMKEY_POPOVER_HEIGHT / 2,
      side: 'right',
    };
  } else if (
    window.innerWidth - 200 < right ||
    (isThin && !isLeftSideKey)
  ) {
    return {
      left: left - CUSTOMKEY_POPOVER_WIDTH - CUSTOMKEY_POPOVER_TRIANGLE / 2,
      top:
        top +
        height / 2 +
        CUSTOMKEY_POPOVER_TRIANGLE -
        CUSTOMKEY_POPOVER_HEIGHT / 2,
      side: 'left',
    };
  } else if (top < 255) {
    return {
      left: left + width / 2 - CUSTOMKEY_POPOVER_WIDTH / 2,
      top: top + height + CUSTOMKEY_POPOVER_TRIANGLE,
      side: 'below',
    };
  } else {
    return {
      left: left + width / 2 - CUSTOMKEY_POPOVER_WIDTH / 2,
      top: top - CUSTOMKEY_POPOVER_HEIGHT,
      side: 'above',
    };
  }
}

export default function VisualKeymapEditor({
  keymapCode,
  keyboardJsonCode,
  onChangeCode,
}: VisualKeymapEditorProps) {
  // Local state for the parsed keymap — updated optimistically on edits,
  // and synced from props when the external code changes.
  const [localKeymap, setLocalKeymap] = useState<ParsedKeymap | null>(null);
  // Track the last keymapCode prop we received to detect external changes.
  // Using a ref to avoid triggering re-sync from our own updates.
  const prevKeymapCodeRef = useRef<string>('');

  const [selectedLayer, setSelectedLayer] = useState(0);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    left: 0,
    top: 0,
    side: 'below',
  });
  const [selectedKeyValue, setSelectedKeyValue] = useState<Key | null>(null);

  // Sync local keymap from external code changes (e.g., switching from Code Editor).
  // Only re-parse when the prop actually changes from what we last saw.
  useEffect(() => {
    if (keymapCode !== prevKeymapCodeRef.current) {
      prevKeymapCodeRef.current = keymapCode;
      const parsed = parseKeymapC(keymapCode);
      setLocalKeymap(parsed);
    }
  }, [keymapCode]);

  // Parse keyboard.json to get layout info
  const layoutData = useMemo(() => {
    if (!keyboardJsonCode) return null;
    try {
      const parsed = parseQmkKeyboardJson(keyboardJsonCode);
      if (parsed.layoutNames.length === 0) return null;
      const layoutName = parsed.layoutNames[0];
      const keyModels = parsed.getKeyModels(layoutName);
      const viewContent = getLayoutViewContent(keyModels);

      // Calculate keys per row by grouping layout keys by their matrix row
      const layoutKeys = parsed.getLayoutKeys(layoutName);
      const rowMap = new Map<number, number>();
      for (const key of layoutKeys) {
        const row = key.matrix[0];
        rowMap.set(row, (rowMap.get(row) ?? 0) + 1);
      }
      const keysPerRow = Array.from(rowMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([, count]) => count);

      return { keyModels, viewContent, keysPerRow };
    } catch {
      return null;
    }
  }, [keyboardJsonCode]);

  // Reset popover and selection when layer changes
  useEffect(() => {
    setPopoverOpen(false);
    setSelectedKeyIndex(null);
    setSelectedKeyValue(null);
  }, [selectedLayer]);

  // Convert keycode names to display labels for current layer.
  // Pad with KC_NO labels if keyboard.json has more keys than keymap.c.
  const keyLabels = useMemo(() => {
    if (!localKeymap || selectedLayer >= localKeymap.layers.length) return [];
    const names = localKeymap.layers[selectedLayer].keycodeNames;
    const layoutCount = layoutData?.keyModels.length ?? names.length;
    const labels = names.map(resolveKeycapLabel);
    while (labels.length < layoutCount) {
      labels.push({ label: '', meta: '', isCustom: false });
    }
    return labels;
  }, [localKeymap, selectedLayer, layoutData]);

  // Apply a change to the local keymap and propagate to parent.
  const applyKeymapUpdate = useCallback(
    (updatedKeymap: ParsedKeymap) => {
      setLocalKeymap(updatedKeymap);
      const newCode = generateKeymapC(
        updatedKeymap,
        layoutData?.keysPerRow
      );
      // Update the ref so the useEffect won't re-parse when this code
      // comes back from the parent via props.
      prevKeymapCodeRef.current = newCode;
      onChangeCode(newCode);
    },
    [onChangeCode, layoutData]
  );

  const handleKeyClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      try {
        if (!localKeymap || !layoutData) return;
        if (selectedLayer >= localKeymap.layers.length) return;

        // If the key index is beyond the current keymap, expand with KC_NO
        const currentNames = localKeymap.layers[selectedLayer].keycodeNames;
        if (index >= currentNames.length) {
          const expandedNames = [...currentNames];
          while (expandedNames.length <= index) {
            expandedNames.push('KC_NO');
          }
          const updatedLayers = localKeymap.layers.map((layer, i) => {
            if (i !== selectedLayer) return layer;
            return { ...layer, keycodeNames: expandedNames };
          });
          applyKeymapUpdate({ ...localKeymap, layers: updatedLayers });
        }

        const keycodeName =
          index < currentNames.length ? currentNames[index] : 'KC_NO';
        const key = resolveKeyForPopover(keycodeName);
        if (!key) return;

        const position = calculatePopoverPosition(
          e.currentTarget as HTMLElement
        );

        setSelectedKeyIndex(index);
        setSelectedKeyValue(key);
        setPopoverPosition(position);
        setPopoverOpen(true);
      } catch (err) {
        console.error('Failed to handle key click:', err);
      }
    },
    [localKeymap, layoutData, selectedLayer]
  );

  const handleKeyChange = useCallback(
    (newKey: Key) => {
      if (
        !localKeymap ||
        selectedKeyIndex === null ||
        selectedLayer >= localKeymap.layers.length
      ) {
        return;
      }

      const newName = codeToName(newKey.keymap.code);

      const updatedLayers = localKeymap.layers.map((layer, i) => {
        if (i !== selectedLayer) return layer;
        const updatedNames = [...layer.keycodeNames];
        // Expand if needed
        while (updatedNames.length <= selectedKeyIndex) {
          updatedNames.push('KC_NO');
        }
        updatedNames[selectedKeyIndex] = newName;
        return { ...layer, keycodeNames: updatedNames };
      });

      applyKeymapUpdate({ ...localKeymap, layers: updatedLayers });

      // Update the selected key value for the popover
      const updatedKey = resolveKeyForPopover(newName);
      if (updatedKey) {
        setSelectedKeyValue(updatedKey);
      }
    },
    [localKeymap, selectedKeyIndex, selectedLayer, applyKeymapUpdate]
  );

  const handleAddLayer = useCallback(() => {
    if (!localKeymap) return;

    const lastLayer = localKeymap.layers[localKeymap.layers.length - 1];
    const lastIndex = parseInt(lastLayer.index);
    const newLayerIndex = isNaN(lastIndex)
      ? String(localKeymap.layers.length)
      : String(lastIndex + 1);
    const keyCount = lastLayer.keycodeNames.length;
    const newLayer = {
      index: newLayerIndex,
      keycodeNames: Array(keyCount).fill('KC_NO') as string[],
    };

    applyKeymapUpdate({
      ...localKeymap,
      layers: [...localKeymap.layers, newLayer],
    });
  }, [localKeymap, applyKeymapUpdate]);

  const handleDeleteLayer = useCallback(() => {
    if (!localKeymap || localKeymap.layers.length <= 1) return;

    const updatedLayers = localKeymap.layers.filter(
      (_, i) => i !== selectedLayer
    );

    applyKeymapUpdate({ ...localKeymap, layers: updatedLayers });

    if (selectedLayer >= updatedLayers.length) {
      setSelectedLayer(updatedLayers.length - 1);
    }
  }, [localKeymap, selectedLayer, applyKeymapUpdate]);

  // Error states
  if (!keyboardJsonCode) {
    return (
      <div className="visual-keymap-error">
        <Typography variant="body2">
          {t('No keyboard.json found in this project.')}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('Please generate files first to use the visual editor.')}
        </Typography>
      </div>
    );
  }

  if (!layoutData) {
    return (
      <div className="visual-keymap-error">
        <Typography variant="body2">
          {t('Could not parse keyboard.json layout.')}
        </Typography>
      </div>
    );
  }

  if (!localKeymap) {
    return (
      <div className="visual-keymap-error">
        <Typography variant="body2">
          {t('Could not parse keymap.c file.')}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('Please use the Code Editor to fix syntax errors.')}
        </Typography>
      </div>
    );
  }

  const { keyModels, viewContent } = layoutData;

  // Always show all keyboard.json keys. If keymap.c has fewer keycodes,
  // the extra keys are treated as KC_NO and can be assigned via the editor.

  const keyboardWidth = viewContent.width + 16;
  const keyboardHeight = viewContent.height + 16;

  return (
    <div className="visual-keymap-editor">
      <LayerSelector
        layerCount={localKeymap.layers.length}
        selectedLayer={selectedLayer}
        onSelectLayer={setSelectedLayer}
        onAddLayer={handleAddLayer}
        onDeleteLayer={handleDeleteLayer}
      />
      <div className="visual-keymap-keyboard-area">
        <div
          className="visual-keymap-keyboard-root"
          style={{ width: keyboardWidth, height: keyboardHeight }}
        >
          <div
            className="visual-keymap-keyboard-frame"
            style={{
              width: viewContent.width,
              height: viewContent.height,
            }}
          >
            {keyModels.map((model, index) => (
              <VisualKeycap
                key={`${model.pos}-${index}`}
                model={model}
                label={keyLabels[index]?.label ?? '?'}
                meta={keyLabels[index]?.meta ?? ''}
                isCustom={keyLabels[index]?.isCustom ?? false}
                isSelected={selectedKeyIndex === index && popoverOpen}
                onClick={(e) => handleKeyClick(index, e)}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedKeyValue && (
        <CustomKey
          id="visual-keymap-customkey-popover"
          open={popoverOpen}
          position={popoverPosition}
          value={selectedKeyValue}
          layerCount={localKeymap.layers.length}
          labelLang="en-us"
          bleMicroPro={false}
          onClose={() => {
            setPopoverOpen(false);
            setSelectedKeyIndex(null);
          }}
          onChange={handleKeyChange}
          customKeycodes={undefined}
        />
      )}
    </div>
  );
}
