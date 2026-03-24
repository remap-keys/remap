import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { t } from 'i18next';
import {
  DEVELOPMENT_BOARD_MCUS,
  INTEGRATED_MCUS,
  MCU2BOOTLOADER,
} from '../../../services/workbench/constants/McuConstants';
import './KeyboardJsonEditorDialog.scss';

type MCUType = 'development_board' | 'integrated_mcu';

const COMMON_QMK_FEATURES = [
  'bootmagic',
  'extrakey',
  'mousekey',
  'nkro',
  'rgblight',
  'rgb_matrix',
  'audio',
  'encoder',
  'oled',
  'console',
  'command',
  'backlight',
  'via',
];

const COMMON_RGBLIGHT_ANIMATIONS = [
  'alternating',
  'breathing',
  'christmas',
  'knight',
  'rainbow_mood',
  'rainbow_swirl',
  'rgb_test',
  'snake',
  'static_gradient',
  'twinkle',
];

type EncoderEntry = { pin_a: string; pin_b: string; resolution: string };

// Section header component
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="subtitle2"
      className="keyboard-json-editor-section-header"
    >
      {children}
    </Typography>
  );
}

// Validation functions
function validateSingleByteString(value: string, maxLength: number): boolean {
  if (!value || value.trim() === '') return false;
  if (value.length > maxLength) return false;
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]*$/.test(value);
}

function validateHexId(value: string): boolean {
  if (!value || value.trim() === '') return false;
  if (value.length > 4) return false;
  return /^[0-9A-Fa-f]+$/.test(value);
}

type KeyboardJsonEditorDialogProps = {
  open: boolean;
  onClose: () => void;
  keyboardJsonContent: string | null;
  onApply?: (updatedContent: string) => void;
};

export default function KeyboardJsonEditorDialog(
  props: KeyboardJsonEditorDialogProps
) {
  // Metadata
  const [keyboardName, setKeyboardName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [maintainer, setMaintainer] = useState('');
  const [url, setUrl] = useState('');
  const [bootloaderInstructions, setBootloaderInstructions] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // USB
  const [vid, setVid] = useState('');
  const [pid, setPid] = useState('');
  const [deviceVersion, setDeviceVersion] = useState('');
  const [maxPower, setMaxPower] = useState('');

  // MCU
  const [mcuType, setMcuType] = useState<MCUType>('development_board');
  const [developmentBoard, setDevelopmentBoard] = useState('');
  const [processor, setProcessor] = useState('');
  const [bootloader, setBootloader] = useState('');

  // Build
  const [buildLto, setBuildLto] = useState(false);
  const [firmwareFormat, setFirmwareFormat] = useState('');
  const [debounceType, setDebounceType] = useState('');

  // Hardware
  const [diodeDirection, setDiodeDirection] = useState('COL2ROW');
  const [matrixCols, setMatrixCols] = useState('');
  const [matrixRows, setMatrixRows] = useState('');
  const [debounce, setDebounce] = useState('');

  // Split
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splitSerialDriver, setSplitSerialDriver] = useState('');
  const [splitSerialPin, setSplitSerialPin] = useState('');

  // WS2812
  const [ws2812Pin, setWs2812Pin] = useState('');
  const [ws2812Driver, setWs2812Driver] = useState('');
  const [ws2812Rgbw, setWs2812Rgbw] = useState(false);

  // RGB Light
  const [rgblightLedCount, setRgblightLedCount] = useState('');
  const [rgblightLedMap, setRgblightLedMap] = useState('');
  const [rgblightSleep, setRgblightSleep] = useState(false);
  const [rgblightSplit, setRgblightSplit] = useState(false);
  const [rgblightSplitCount, setRgblightSplitCount] = useState('');
  const [rgblightHueSteps, setRgblightHueSteps] = useState('');
  const [rgblightSatSteps, setRgblightSatSteps] = useState('');
  const [rgblightBriSteps, setRgblightBriSteps] = useState('');
  const [rgblightMaxBrightness, setRgblightMaxBrightness] = useState('');
  const [rgblightAnimations, setRgblightAnimations] = useState<
    Record<string, boolean>
  >({});

  // Encoder
  const [encoderRotary, setEncoderRotary] = useState<EncoderEntry[]>([]);

  // Features
  const [features, setFeatures] = useState<Record<string, boolean>>({});

  // Initialize form from JSON content
  useEffect(() => {
    if (!props.open || !props.keyboardJsonContent) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const json: any = JSON.parse(props.keyboardJsonContent);

      // Metadata
      setKeyboardName(json.keyboard_name ?? '');
      setManufacturer(json.manufacturer ?? '');
      setMaintainer(json.maintainer ?? '');
      setUrl(json.url ?? '');
      setBootloaderInstructions(json.bootloader_instructions ?? '');
      setTags(Array.isArray(json.tags) ? [...json.tags] : []);
      setTagInput('');

      // USB
      const rawVid = String(json.usb?.vid ?? '');
      const rawPid = String(json.usb?.pid ?? '');
      setVid(rawVid.replace(/^0x/i, ''));
      setPid(rawPid.replace(/^0x/i, ''));
      setDeviceVersion(json.usb?.device_version ?? '1.0.0');
      setMaxPower(
        json.usb?.max_power !== undefined ? String(json.usb.max_power) : ''
      );

      // MCU
      if (json.development_board) {
        setMcuType('development_board');
        setDevelopmentBoard(json.development_board);
        setProcessor('');
        setBootloader('');
      } else {
        setMcuType('integrated_mcu');
        setDevelopmentBoard('');
        setProcessor(json.processor ?? '');
        setBootloader(
          json.bootloader ??
            MCU2BOOTLOADER[json.processor as keyof typeof MCU2BOOTLOADER] ??
            ''
        );
      }

      // Build
      setBuildLto(json.build?.lto ?? false);
      setFirmwareFormat(json.build?.firmware_format ?? '');
      setDebounceType(json.build?.debounce_type ?? '');

      // Hardware
      setDiodeDirection(json.diode_direction ?? 'COL2ROW');
      setMatrixCols(
        Array.isArray(json.matrix_pins?.cols)
          ? json.matrix_pins.cols.join(', ')
          : ''
      );
      setMatrixRows(
        Array.isArray(json.matrix_pins?.rows)
          ? json.matrix_pins.rows.join(', ')
          : ''
      );
      setDebounce(json.debounce !== undefined ? String(json.debounce) : '');

      // Split
      setSplitEnabled(json.split?.enabled ?? false);
      setSplitSerialDriver(json.split?.serial?.driver ?? '');
      setSplitSerialPin(json.split?.serial?.pin ?? '');

      // WS2812
      setWs2812Pin(json.ws2812?.pin ?? '');
      setWs2812Driver(json.ws2812?.driver ?? '');
      setWs2812Rgbw(json.ws2812?.rgbw ?? false);

      // RGB Light
      setRgblightLedCount(
        json.rgblight?.led_count !== undefined
          ? String(json.rgblight.led_count)
          : ''
      );
      setRgblightLedMap(
        Array.isArray(json.rgblight?.led_map)
          ? json.rgblight.led_map.join(', ')
          : ''
      );
      setRgblightSleep(json.rgblight?.sleep ?? false);
      setRgblightSplit(json.rgblight?.split ?? false);
      setRgblightSplitCount(
        Array.isArray(json.rgblight?.split_count)
          ? json.rgblight.split_count.join(', ')
          : ''
      );
      setRgblightHueSteps(
        json.rgblight?.hue_steps !== undefined
          ? String(json.rgblight.hue_steps)
          : ''
      );
      setRgblightSatSteps(
        json.rgblight?.saturation_steps !== undefined
          ? String(json.rgblight.saturation_steps)
          : ''
      );
      setRgblightBriSteps(
        json.rgblight?.brightness_steps !== undefined
          ? String(json.rgblight.brightness_steps)
          : ''
      );
      setRgblightMaxBrightness(
        json.rgblight?.max_brightness !== undefined
          ? String(json.rgblight.max_brightness)
          : ''
      );
      setRgblightAnimations(
        json.rgblight?.animations &&
          typeof json.rgblight.animations === 'object'
          ? { ...json.rgblight.animations }
          : {}
      );

      // Encoder
      if (Array.isArray(json.encoder?.rotary)) {
        setEncoderRotary(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          json.encoder.rotary.map((e: any) => ({
            pin_a: e.pin_a ?? '',
            pin_b: e.pin_b ?? '',
            resolution: e.resolution !== undefined ? String(e.resolution) : '',
          }))
        );
      } else {
        setEncoderRotary([]);
      }

      // Features
      setFeatures(
        json.features && typeof json.features === 'object'
          ? { ...json.features }
          : {}
      );
    } catch {
      // Invalid JSON - leave defaults
    }
  }, [props.open, props.keyboardJsonContent]);

  // Auto-set bootloader when processor changes
  const handleProcessorChange = useCallback((value: string) => {
    setProcessor(value);
    const mapped = MCU2BOOTLOADER[value as keyof typeof MCU2BOOTLOADER] ?? '';
    setBootloader(mapped);
  }, []);

  // Feature toggle/add/remove
  const handleFeatureToggle = useCallback((name: string, checked: boolean) => {
    setFeatures((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handleAddFeature = useCallback((name: string | null) => {
    if (!name || name.trim() === '') return;
    setFeatures((prev) => ({ ...prev, [name.trim()]: true }));
  }, []);

  const handleRemoveFeature = useCallback((name: string) => {
    setFeatures((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  // Tags
  const handleAddTag = useCallback(() => {
    if (!tagInput.trim()) return;
    setTags((prev) =>
      prev.includes(tagInput.trim()) ? prev : [...prev, tagInput.trim()]
    );
    setTagInput('');
  }, [tagInput]);

  const handleDeleteTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  // Encoder
  const handleAddEncoder = useCallback(() => {
    setEncoderRotary((prev) => [
      ...prev,
      { pin_a: '', pin_b: '', resolution: '' },
    ]);
  }, []);

  const handleDeleteEncoder = useCallback((index: number) => {
    setEncoderRotary((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleEncoderChange = useCallback(
    (index: number, field: keyof EncoderEntry, value: string) => {
      setEncoderRotary((prev) =>
        prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  // RGBLight animation toggle
  const handleRgblightAnimToggle = useCallback(
    (name: string, checked: boolean) => {
      setRgblightAnimations((prev) => ({ ...prev, [name]: checked }));
    },
    []
  );

  // Apply
  const handleApply = useCallback(() => {
    if (!props.keyboardJsonContent || !props.onApply) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = JSON.parse(props.keyboardJsonContent);

    // Metadata
    json.keyboard_name = keyboardName;
    json.manufacturer = manufacturer;
    json.maintainer = maintainer;
    if (url.trim()) {
      json.url = url;
    } else {
      delete json.url;
    }
    if (bootloaderInstructions.trim()) {
      json.bootloader_instructions = bootloaderInstructions;
    } else {
      delete json.bootloader_instructions;
    }
    if (tags.length > 0) {
      json.tags = tags;
    } else {
      delete json.tags;
    }

    // USB
    json.usb = json.usb || {};
    json.usb.vid = `0x${vid.toUpperCase().padStart(4, '0')}`;
    json.usb.pid = `0x${pid.toUpperCase().padStart(4, '0')}`;
    json.usb.device_version = deviceVersion;
    if (maxPower.trim() && !isNaN(Number(maxPower))) {
      json.usb.max_power = Number(maxPower);
    } else {
      delete json.usb.max_power;
    }

    // MCU
    if (mcuType === 'development_board') {
      json.development_board = developmentBoard;
      delete json.processor;
      delete json.bootloader;
    } else {
      json.processor = processor;
      json.bootloader = bootloader;
      delete json.development_board;
    }

    // Build
    const buildObj = json.build || {};
    buildObj.lto = buildLto;
    if (firmwareFormat) {
      buildObj.firmware_format = firmwareFormat;
    } else {
      delete buildObj.firmware_format;
    }
    if (debounceType) {
      buildObj.debounce_type = debounceType;
    } else {
      delete buildObj.debounce_type;
    }
    if (Object.keys(buildObj).length > 0) {
      json.build = buildObj;
    }

    // Hardware
    json.diode_direction = diodeDirection;
    json.matrix_pins = {
      ...(json.matrix_pins || {}),
      cols: matrixCols
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      rows: matrixRows
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (debounce.trim() && !isNaN(Number(debounce))) {
      json.debounce = Number(debounce);
    } else {
      delete json.debounce;
    }

    // Split
    if (splitEnabled) {
      json.split = json.split || {};
      json.split.enabled = true;
      if (splitSerialDriver || splitSerialPin) {
        json.split.serial = json.split.serial || {};
        if (splitSerialDriver) {
          json.split.serial.driver = splitSerialDriver;
        }
        if (splitSerialPin) {
          json.split.serial.pin = splitSerialPin;
        }
      }
    } else if (json.split) {
      json.split.enabled = false;
    }

    // WS2812
    if (ws2812Pin || ws2812Driver || ws2812Rgbw) {
      json.ws2812 = json.ws2812 || {};
      if (ws2812Pin) json.ws2812.pin = ws2812Pin;
      else delete json.ws2812.pin;
      if (ws2812Driver) json.ws2812.driver = ws2812Driver;
      else delete json.ws2812.driver;
      if (ws2812Rgbw) json.ws2812.rgbw = true;
      else delete json.ws2812.rgbw;
    }

    // RGB Light
    if (json.rgblight || rgblightLedCount) {
      json.rgblight = json.rgblight || {};
      if (rgblightLedCount.trim() && !isNaN(Number(rgblightLedCount))) {
        json.rgblight.led_count = Number(rgblightLedCount);
      }
      const ledMapValues = rgblightLedMap
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => !isNaN(n));
      if (ledMapValues.length > 0) {
        json.rgblight.led_map = ledMapValues;
      } else {
        delete json.rgblight.led_map;
      }
      json.rgblight.sleep = rgblightSleep;
      if (rgblightSplit) {
        json.rgblight.split = true;
        const splitCountValues = rgblightSplitCount
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number)
          .filter((n) => !isNaN(n));
        if (splitCountValues.length === 2) {
          json.rgblight.split_count = splitCountValues;
        }
      } else {
        delete json.rgblight.split;
        delete json.rgblight.split_count;
      }
      const setOptionalUint = (
        obj: Record<string, unknown>,
        key: string,
        val: string
      ) => {
        if (val.trim() && !isNaN(Number(val))) {
          obj[key] = Number(val);
        } else {
          delete obj[key];
        }
      };
      setOptionalUint(json.rgblight, 'hue_steps', rgblightHueSteps);
      setOptionalUint(json.rgblight, 'saturation_steps', rgblightSatSteps);
      setOptionalUint(json.rgblight, 'brightness_steps', rgblightBriSteps);
      setOptionalUint(json.rgblight, 'max_brightness', rgblightMaxBrightness);
      if (Object.keys(rgblightAnimations).length > 0) {
        json.rgblight.animations = { ...rgblightAnimations };
      }
    }

    // Encoder
    if (encoderRotary.length > 0) {
      json.encoder = json.encoder || {};
      json.encoder.rotary = encoderRotary.map((e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry: any = { pin_a: e.pin_a, pin_b: e.pin_b };
        if (e.resolution && !isNaN(Number(e.resolution))) {
          entry.resolution = Number(e.resolution);
        }
        return entry;
      });
    } else if (json.encoder) {
      delete json.encoder.rotary;
    }

    // Features
    json.features = { ...features };

    const updated = JSON.stringify(json, null, 2);
    props.onApply(updated);
    props.onClose();
  }, [
    props.keyboardJsonContent,
    props.onApply,
    keyboardName,
    manufacturer,
    maintainer,
    url,
    bootloaderInstructions,
    tags,
    vid,
    pid,
    deviceVersion,
    maxPower,
    mcuType,
    developmentBoard,
    processor,
    bootloader,
    buildLto,
    firmwareFormat,
    debounceType,
    diodeDirection,
    matrixCols,
    matrixRows,
    debounce,
    splitEnabled,
    splitSerialDriver,
    splitSerialPin,
    ws2812Pin,
    ws2812Driver,
    ws2812Rgbw,
    rgblightLedCount,
    rgblightLedMap,
    rgblightSleep,
    rgblightSplit,
    rgblightSplitCount,
    rgblightHueSteps,
    rgblightSatSteps,
    rgblightBriSteps,
    rgblightMaxBrightness,
    rgblightAnimations,
    encoderRotary,
    features,
  ]);

  const keyboardNameValid = validateSingleByteString(keyboardName, 256);
  const manufacturerValid = validateSingleByteString(manufacturer, 256);
  const maintainerValid = validateSingleByteString(maintainer, 256);
  const vidValid = validateHexId(vid);
  const pidValid = validateHexId(pid);
  const mcuValid =
    mcuType === 'development_board'
      ? developmentBoard.trim() !== ''
      : processor.trim() !== '';

  const isFormValid =
    keyboardNameValid &&
    manufacturerValid &&
    maintainerValid &&
    vidValid &&
    pidValid &&
    mcuValid;

  const availableFeatures = COMMON_QMK_FEATURES.filter((f) => !(f in features));

  const availableRgblightAnimations = COMMON_RGBLIGHT_ANIMATIONS.filter(
    (a) => !(a in rgblightAnimations)
  );

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>{t('Keyboard JSON Editor')}</DialogTitle>
      <Tabs
        value={activeTab}
        onChange={(_e, v) => setActiveTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
      >
        <Tab label={t('General')} />
        <Tab label={t('USB / MCU')} />
        <Tab label={t('Hardware')} />
        <Tab label={t('Features')} />
        <Tab label={t('Lighting')} />
        <Tab label={t('Input')} />
      </Tabs>
      <DialogContent dividers>
        {/* === General Tab === */}
        {activeTab === 0 && (
          <Stack spacing={3}>
            {/* Metadata Section */}
            <div>
              <SectionHeader>{t('Metadata')}</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label={t('Keyboard Name')}
                  size="small"
                  fullWidth
                  value={keyboardName}
                  onChange={(e) => setKeyboardName(e.target.value)}
                  error={keyboardName !== '' && !keyboardNameValid}
                />
                <TextField
                  label={t('Manufacturer')}
                  size="small"
                  fullWidth
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  error={manufacturer !== '' && !manufacturerValid}
                />
                <TextField
                  label={t('Maintainer')}
                  size="small"
                  fullWidth
                  value={maintainer}
                  onChange={(e) => setMaintainer(e.target.value)}
                  error={maintainer !== '' && !maintainerValid}
                />
                <TextField
                  label={t('URL')}
                  size="small"
                  fullWidth
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <TextField
                  label={t('Bootloader Instructions')}
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  value={bootloaderInstructions}
                  onChange={(e) => setBootloaderInstructions(e.target.value)}
                />
                <div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <TextField
                      label={t('Tags')}
                      size="small"
                      fullWidth
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder={t('Press Enter to add')}
                    />
                    <IconButton size="small" onClick={handleAddTag}>
                      <AddIcon />
                    </IconButton>
                  </div>
                  {tags.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        marginTop: 8,
                      }}
                    >
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          onDelete={() => handleDeleteTag(tag)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Stack>
            </div>
          </Stack>
        )}

        {/* === USB / MCU Tab === */}
        {activeTab === 1 && (
          <Stack spacing={3}>
            {/* USB Section */}
            <div>
              <SectionHeader>{t('USB')}</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextField
                    label={t('Vendor ID')}
                    size="small"
                    value={vid}
                    onChange={(e) => setVid(e.target.value)}
                    error={vid !== '' && !vidValid}
                    placeholder="FEED"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">0x</InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 4 }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label={t('Product ID')}
                    size="small"
                    value={pid}
                    onChange={(e) => setPid(e.target.value)}
                    error={pid !== '' && !pidValid}
                    placeholder="0000"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">0x</InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 4 }}
                    sx={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextField
                    label={t('Device Version')}
                    size="small"
                    value={deviceVersion}
                    onChange={(e) => setDeviceVersion(e.target.value)}
                    placeholder="1.0.0"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label={t('Max Power (mA)')}
                    size="small"
                    type="number"
                    value={maxPower}
                    onChange={(e) => setMaxPower(e.target.value)}
                    placeholder="500"
                    inputProps={{ min: 0 }}
                    sx={{ flex: 1 }}
                  />
                </div>
              </Stack>
            </div>

            {/* MCU Section */}
            <div>
              <SectionHeader>{t('MCU')}</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <RadioGroup
                  value={mcuType}
                  onChange={(e) => setMcuType(e.target.value as MCUType)}
                >
                  <FormControlLabel
                    value="development_board"
                    control={<Radio size="small" />}
                    label={t('A separate development board (ex. Pro Micro)')}
                  />
                  <FormControlLabel
                    value="integrated_mcu"
                    control={<Radio size="small" />}
                    label={t('The microcontroller integrated on the PCB')}
                  />
                </RadioGroup>
                {mcuType === 'development_board' ? (
                  <FormControl size="small" fullWidth>
                    <InputLabel>{t('Development Board')}</InputLabel>
                    <Select
                      value={developmentBoard}
                      label={t('Development Board')}
                      onChange={(e) => setDevelopmentBoard(e.target.value)}
                    >
                      {DEVELOPMENT_BOARD_MCUS.map((mcu) => (
                        <MenuItem key={mcu} value={mcu}>
                          {mcu}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <>
                    <FormControl size="small" fullWidth>
                      <InputLabel>{t('Processor')}</InputLabel>
                      <Select
                        value={processor}
                        label={t('Processor')}
                        onChange={(e) => handleProcessorChange(e.target.value)}
                      >
                        {INTEGRATED_MCUS.map((mcu) => (
                          <MenuItem key={mcu} value={mcu}>
                            {mcu}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label={t('Bootloader')}
                      size="small"
                      fullWidth
                      value={bootloader}
                      onChange={(e) => setBootloader(e.target.value)}
                    />
                  </>
                )}
              </Stack>
            </div>
          </Stack>
        )}

        {/* === Hardware Tab === */}
        {activeTab === 2 && (
          <Stack spacing={3}>
            {/* Build Section */}
            <div>
              <SectionHeader>{t('Build')}</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={buildLto}
                      onChange={(e) => setBuildLto(e.target.checked)}
                    />
                  }
                  label={t('Link Time Optimization (LTO)')}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>{t('Firmware Format')}</InputLabel>
                    <Select
                      value={firmwareFormat}
                      label={t('Firmware Format')}
                      onChange={(e) => setFirmwareFormat(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>{t('Default')}</em>
                      </MenuItem>
                      <MenuItem value="bin">bin</MenuItem>
                      <MenuItem value="hex">hex</MenuItem>
                      <MenuItem value="uf2">uf2</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>{t('Debounce Type')}</InputLabel>
                    <Select
                      value={debounceType}
                      label={t('Debounce Type')}
                      onChange={(e) => setDebounceType(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>{t('Default')}</em>
                      </MenuItem>
                      <MenuItem value="sym_defer_g">sym_defer_g</MenuItem>
                      <MenuItem value="sym_defer_pk">sym_defer_pk</MenuItem>
                      <MenuItem value="sym_defer_pr">sym_defer_pr</MenuItem>
                      <MenuItem value="sym_eager_pk">sym_eager_pk</MenuItem>
                      <MenuItem value="sym_eager_pr">sym_eager_pr</MenuItem>
                      <MenuItem value="asym_eager_defer_pk">
                        asym_eager_defer_pk
                      </MenuItem>
                      <MenuItem value="custom">custom</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Stack>
            </div>

            {/* Hardware Section */}
            <div>
              <SectionHeader>{t('Hardware')}</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>{t('Diode Direction')}</InputLabel>
                    <Select
                      value={diodeDirection}
                      label={t('Diode Direction')}
                      onChange={(e) => setDiodeDirection(e.target.value)}
                    >
                      <MenuItem value="COL2ROW">COL2ROW</MenuItem>
                      <MenuItem value="ROW2COL">ROW2COL</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label={t('Debounce (ms)')}
                    size="small"
                    type="number"
                    value={debounce}
                    onChange={(e) => setDebounce(e.target.value)}
                    placeholder="5"
                    inputProps={{ min: 0 }}
                    sx={{ flex: 1 }}
                  />
                </div>
                <TextField
                  label={t('Matrix Pin Columns')}
                  size="small"
                  fullWidth
                  value={matrixCols}
                  onChange={(e) => setMatrixCols(e.target.value)}
                  placeholder="C0, C1, C2, C3"
                />
                <TextField
                  label={t('Matrix Pin Rows')}
                  size="small"
                  fullWidth
                  value={matrixRows}
                  onChange={(e) => setMatrixRows(e.target.value)}
                  placeholder="D0, D1, D2, D3"
                />
              </Stack>
            </div>

            {/* Split Section */}
            <div>
              <SectionHeader>{t('Split Keyboard')}</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={splitEnabled}
                      onChange={(e) => setSplitEnabled(e.target.checked)}
                    />
                  }
                  label={t('Enabled')}
                />
                {splitEnabled && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <InputLabel>{t('Serial Driver')}</InputLabel>
                      <Select
                        value={splitSerialDriver}
                        label={t('Serial Driver')}
                        onChange={(e) => setSplitSerialDriver(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>{t('Default')}</em>
                        </MenuItem>
                        <MenuItem value="bitbang">bitbang</MenuItem>
                        <MenuItem value="usart">usart</MenuItem>
                        <MenuItem value="vendor">vendor</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label={t('Serial Pin')}
                      size="small"
                      value={splitSerialPin}
                      onChange={(e) => setSplitSerialPin(e.target.value)}
                      placeholder="D0"
                      sx={{ flex: 1 }}
                    />
                  </div>
                )}
              </Stack>
            </div>
          </Stack>
        )}

        {/* === Features Tab === */}
        {activeTab === 3 && (
          <Stack spacing={3}>
            <div>
              <SectionHeader>{t('Features')}</SectionHeader>
              <div className="keyboard-json-editor-features">
                {Object.entries(features)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([name, enabled]) => (
                    <FormControlLabel
                      key={name}
                      control={
                        <Switch
                          size="small"
                          checked={enabled}
                          onChange={(e) =>
                            handleFeatureToggle(name, e.target.checked)
                          }
                        />
                      }
                      label={name}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleRemoveFeature(name);
                      }}
                    />
                  ))}
              </div>
              {availableFeatures.length > 0 && (
                <Autocomplete
                  size="small"
                  options={availableFeatures}
                  freeSolo
                  sx={{ mt: 1 }}
                  renderInput={(params) => (
                    <TextField {...params} label={t('Add Feature')} />
                  )}
                  onChange={(_e, value) => handleAddFeature(value)}
                  value={null}
                  blurOnSelect
                  clearOnBlur
                />
              )}
            </div>
          </Stack>
        )}

        {/* === Lighting Tab === */}
        {activeTab === 4 && (
          <Stack spacing={3}>
            {/* WS2812 Section */}
            <div>
              <SectionHeader>WS2812</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextField
                    label={t('Pin')}
                    size="small"
                    value={ws2812Pin}
                    onChange={(e) => setWs2812Pin(e.target.value)}
                    placeholder="GP6"
                    sx={{ flex: 1 }}
                  />
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>{t('Driver')}</InputLabel>
                    <Select
                      value={ws2812Driver}
                      label={t('Driver')}
                      onChange={(e) => setWs2812Driver(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>{t('Default')}</em>
                      </MenuItem>
                      <MenuItem value="bitbang">bitbang</MenuItem>
                      <MenuItem value="custom">custom</MenuItem>
                      <MenuItem value="i2c">i2c</MenuItem>
                      <MenuItem value="pwm">pwm</MenuItem>
                      <MenuItem value="spi">spi</MenuItem>
                      <MenuItem value="vendor">vendor</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={ws2812Rgbw}
                      onChange={(e) => setWs2812Rgbw(e.target.checked)}
                    />
                  }
                  label="RGBW"
                />
              </Stack>
            </div>

            {/* RGB Light Section */}
            <div>
              <SectionHeader>{t('RGB Light')}</SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label={t('LED Count')}
                  size="small"
                  type="number"
                  value={rgblightLedCount}
                  onChange={(e) => setRgblightLedCount(e.target.value)}
                  inputProps={{ min: 0 }}
                  sx={{ width: '50%' }}
                />
                <TextField
                  label={t('LED Map')}
                  size="small"
                  fullWidth
                  value={rgblightLedMap}
                  onChange={(e) => setRgblightLedMap(e.target.value)}
                  placeholder="0, 1, 2, 3, 4, 5"
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextField
                    label={t('Hue Steps')}
                    size="small"
                    type="number"
                    value={rgblightHueSteps}
                    onChange={(e) => setRgblightHueSteps(e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label={t('Saturation Steps')}
                    size="small"
                    type="number"
                    value={rgblightSatSteps}
                    onChange={(e) => setRgblightSatSteps(e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextField
                    label={t('Brightness Steps')}
                    size="small"
                    type="number"
                    value={rgblightBriSteps}
                    onChange={(e) => setRgblightBriSteps(e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label={t('Max Brightness')}
                    size="small"
                    type="number"
                    value={rgblightMaxBrightness}
                    onChange={(e) => setRgblightMaxBrightness(e.target.value)}
                    inputProps={{ min: 0, max: 255 }}
                    sx={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={rgblightSleep}
                        onChange={(e) => setRgblightSleep(e.target.checked)}
                      />
                    }
                    label={t('Sleep')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={rgblightSplit}
                        onChange={(e) => setRgblightSplit(e.target.checked)}
                      />
                    }
                    label={t('Split')}
                  />
                </div>
                {rgblightSplit && (
                  <TextField
                    label={t('Split Count')}
                    size="small"
                    fullWidth
                    value={rgblightSplitCount}
                    onChange={(e) => setRgblightSplitCount(e.target.value)}
                    placeholder="6, 6"
                  />
                )}
                <div>
                  <Typography variant="caption" color="text.secondary">
                    {t('Animations')}
                  </Typography>
                  <div className="keyboard-json-editor-features">
                    {Object.entries(rgblightAnimations)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([name, enabled]) => (
                        <FormControlLabel
                          key={name}
                          control={
                            <Switch
                              size="small"
                              checked={enabled}
                              onChange={(e) =>
                                handleRgblightAnimToggle(name, e.target.checked)
                              }
                            />
                          }
                          label={name}
                        />
                      ))}
                  </div>
                  {availableRgblightAnimations.length > 0 && (
                    <Autocomplete
                      size="small"
                      options={availableRgblightAnimations}
                      freeSolo
                      sx={{ mt: 1 }}
                      renderInput={(params) => (
                        <TextField {...params} label={t('Add Animation')} />
                      )}
                      onChange={(_e, value) => {
                        if (value) {
                          handleRgblightAnimToggle(value, true);
                        }
                      }}
                      value={null}
                      blurOnSelect
                      clearOnBlur
                    />
                  )}
                </div>
              </Stack>
            </div>
          </Stack>
        )}

        {/* === Input Tab === */}
        {activeTab === 5 && (
          <Stack spacing={3}>
            {/* Encoder Section */}
            <div>
              <SectionHeader>
                {t('Encoder')}
                <IconButton size="small" onClick={handleAddEncoder}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </SectionHeader>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {encoderRotary.map((entry, index) => (
                  <div
                    key={index}
                    style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                  >
                    <TextField
                      label={`Pin A`}
                      size="small"
                      value={entry.pin_a}
                      onChange={(e) =>
                        handleEncoderChange(index, 'pin_a', e.target.value)
                      }
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label={`Pin B`}
                      size="small"
                      value={entry.pin_b}
                      onChange={(e) =>
                        handleEncoderChange(index, 'pin_b', e.target.value)
                      }
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label={t('Resolution')}
                      size="small"
                      type="number"
                      value={entry.resolution}
                      onChange={(e) =>
                        handleEncoderChange(index, 'resolution', e.target.value)
                      }
                      inputProps={{ min: 1 }}
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteEncoder(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
                {encoderRotary.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t('No encoders configured.')}
                  </Typography>
                )}
              </Stack>
            </div>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {props.onApply && (
          <Button onClick={handleApply} disabled={!isFormValid}>
            {t('Apply')}
          </Button>
        )}
        <Button onClick={props.onClose}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
