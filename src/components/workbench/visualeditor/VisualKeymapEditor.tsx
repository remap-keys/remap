import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import {
  parseQmkKeyboardJson,
  getLayoutViewContent,
} from '../../../services/workbench/QmkLayoutParser';
import { parseKeymapC, ParsedKeymap } from '../../../services/workbench/KeymapCParser';
import { generateKeymapC } from '../../../services/workbench/KeymapCGenerator';
import { nameToCode, codeToName } from '../../../services/workbench/QmkKeycodeMapper';
import { KeycodeCompositionFactory } from '../../../services/hid/Composition';
import { KeycodeList } from '../../../services/hid/KeycodeList';
import { genKey, Key } from '../../common/keycodekey/KeyGen';
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

export default function VisualKeymapEditor({
  keymapCode,
  keyboardJsonCode,
  onChangeCode,
}: VisualKeymapEditorProps) {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    left: 0,
    top: 0,
    side: 'below',
  });
  const [selectedKeyValue, setSelectedKeyValue] = useState<Key | null>(null);

  const keyRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Parse keymap.c
  const parsedKeymap = useMemo(
    () => parseKeymapC(keymapCode),
    [keymapCode]
  );

  // Parse keyboard.json to get layout info
  const layoutData = useMemo(() => {
    if (!keyboardJsonCode) return null;
    try {
      const parsed = parseQmkKeyboardJson(keyboardJsonCode);
      if (parsed.layoutNames.length === 0) return null;
      const layoutName = parsed.layoutNames[0];
      const keyModels = parsed.getKeyModels(layoutName);
      const viewContent = getLayoutViewContent(keyModels);
      return { keyModels, viewContent };
    } catch {
      return null;
    }
  }, [keyboardJsonCode]);

  // Convert keycode names to display labels for current layer
  const keyLabels = useMemo(() => {
    if (!parsedKeymap || selectedLayer >= parsedKeymap.layers.length) return [];
    return parsedKeymap.layers[selectedLayer].keycodeNames.map((name) => {
      // Shorten common prefixes for display
      if (name === '_______') return '▽';
      if (name === 'XXXXXXX') return ' ';
      if (name.startsWith('KC_')) return name.substring(3);
      return name;
    });
  }, [parsedKeymap, selectedLayer]);

  const handleKeyClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      if (!parsedKeymap || !layoutData) return;
      if (selectedLayer >= parsedKeymap.layers.length) return;

      const keycodeName =
        parsedKeymap.layers[selectedLayer].keycodeNames[index];
      const code = nameToCode(keycodeName);
      if (code === null) return;

      // Get IKeymap for the code
      const keymap = KeycodeList.getKeymap(code, 'en-us', undefined);
      const key = genKey(keymap, 'en-us');

      // Calculate popover position from the clicked element
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const { left, top, right, height, width } = rect;
      const center = left + width / 2;
      const maxTop = top - CUSTOMKEY_POPOVER_HEIGHT;
      const maxBottom =
        top + height + CUSTOMKEY_POPOVER_TRIANGLE + CUSTOMKEY_POPOVER_HEIGHT;
      const isThin = maxTop < 0 && window.innerHeight < maxBottom;
      const isLeftSideKey = center < window.innerWidth / 2;
      let position: PopoverPosition = { left: 0, top: 0, side: 'above' };

      if (left < 200 || (isThin && isLeftSideKey)) {
        position.left = left + width + CUSTOMKEY_POPOVER_TRIANGLE / 2;
        position.top =
          top + height / 2 + CUSTOMKEY_POPOVER_TRIANGLE - CUSTOMKEY_POPOVER_HEIGHT / 2;
        position.side = 'right';
      } else if (
        window.innerWidth - 200 < right ||
        (isThin && !isLeftSideKey)
      ) {
        position.left =
          left - CUSTOMKEY_POPOVER_WIDTH - CUSTOMKEY_POPOVER_TRIANGLE / 2;
        position.top =
          top + height / 2 + CUSTOMKEY_POPOVER_TRIANGLE - CUSTOMKEY_POPOVER_HEIGHT / 2;
        position.side = 'left';
      } else if (top < 255) {
        position.left = left + width / 2 - CUSTOMKEY_POPOVER_WIDTH / 2;
        position.top = top + height + CUSTOMKEY_POPOVER_TRIANGLE;
        position.side = 'below';
      } else {
        position.left = left + width / 2 - CUSTOMKEY_POPOVER_WIDTH / 2;
        position.top = top - CUSTOMKEY_POPOVER_HEIGHT;
        position.side = 'above';
      }

      setSelectedKeyIndex(index);
      setSelectedKeyValue(key);
      setPopoverPosition(position);
      setPopoverOpen(true);
    },
    [parsedKeymap, layoutData, selectedLayer]
  );

  const handleKeyChange = useCallback(
    (newKey: Key) => {
      if (
        !parsedKeymap ||
        selectedKeyIndex === null ||
        selectedLayer >= parsedKeymap.layers.length
      ) {
        return;
      }

      const newName = codeToName(newKey.keymap.code);

      // Update the parsed keymap with the new keycode name
      const updatedLayers = parsedKeymap.layers.map((layer) => {
        if (layer.index !== parsedKeymap.layers[selectedLayer].index) {
          return layer;
        }
        const updatedNames = [...layer.keycodeNames];
        updatedNames[selectedKeyIndex] = newName;
        return { ...layer, keycodeNames: updatedNames };
      });

      const updatedKeymap: ParsedKeymap = {
        ...parsedKeymap,
        layers: updatedLayers,
      };

      const newCode = generateKeymapC(updatedKeymap);
      onChangeCode(newCode);
    },
    [parsedKeymap, selectedKeyIndex, selectedLayer, onChangeCode]
  );

  const handleAddLayer = useCallback(() => {
    if (!parsedKeymap) return;

    const lastLayer = parsedKeymap.layers[parsedKeymap.layers.length - 1];
    const newLayerIndex = lastLayer.index + 1;
    // Create a new layer with all KC_NO
    const keyCount = lastLayer.keycodeNames.length;
    const newLayer = {
      index: newLayerIndex,
      keycodeNames: Array(keyCount).fill('KC_NO'),
    };

    const updatedKeymap: ParsedKeymap = {
      ...parsedKeymap,
      layers: [...parsedKeymap.layers, newLayer],
    };

    const newCode = generateKeymapC(updatedKeymap);
    onChangeCode(newCode);
  }, [parsedKeymap, onChangeCode]);

  const handleDeleteLayer = useCallback(() => {
    if (!parsedKeymap || parsedKeymap.layers.length <= 1) return;

    const updatedLayers = parsedKeymap.layers.filter(
      (_, i) => i !== selectedLayer
    );

    const updatedKeymap: ParsedKeymap = {
      ...parsedKeymap,
      layers: updatedLayers,
    };

    const newCode = generateKeymapC(updatedKeymap);
    onChangeCode(newCode);

    if (selectedLayer >= updatedLayers.length) {
      setSelectedLayer(updatedLayers.length - 1);
    }
  }, [parsedKeymap, selectedLayer, onChangeCode]);

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

  if (!parsedKeymap) {
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

  // Calculate scale to fit the keyboard in the available space
  const keyboardWidth = viewContent.width + 16;
  const keyboardHeight = viewContent.height + 16;

  return (
    <div className="visual-keymap-editor">
      <LayerSelector
        layerCount={parsedKeymap.layers.length}
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
                label={keyLabels[index] ?? '?'}
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
          layerCount={parsedKeymap.layers.length}
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
