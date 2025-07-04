// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  SelectChangeEvent,
  InputAdornment,
} from '@mui/material';
import { t } from 'i18next';
import {
  AVAILABLE_LAYOUTS,
  DEFAULT_LAYOUT,
} from '../../../services/workbench/constants/LayoutConstants';
import {
  IFileGenerationConfig,
  MCUType,
} from '../../../services/workbench/types/FileGenerationTypes';
import {
  DEVELOPMENT_BOARD_MCUS,
  INTEGRATED_MCUS,
} from '../../../services/workbench/constants/McuConstants';

// MCU Types
const MCU_TYPES: readonly MCUType[] = ['development_board', 'integrated_mcu'];

// MCU Type display names for UI
const MCU_TYPE_DISPLAY_NAMES: Record<MCUType, string> = {
  development_board: 'A separate development board (ex. Pro Micro)',
  integrated_mcu: 'The microcontroller integrated on the PCB',
};

interface FileGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (config: IFileGenerationConfig) => void;
  userDisplayName?: string;
}

export default function FileGenerationDialog(props: FileGenerationDialogProps) {
  const [manufacturerName, setManufacturerName] = useState<string>('');
  const [maintainerName, setMaintainerName] = useState<string>('');
  const [keyboardName, setKeyboardName] = useState<string>('');
  const [mcuType, setMcuType] = useState<MCUType>('development_board');
  const [mcu, setMcu] = useState<string>('promicro');
  const [vendorId, setVendorId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [layout, setLayout] = useState<string>(DEFAULT_LAYOUT);

  // Error state tracking
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (props.open) {
      // Reset all fields to initial values
      setManufacturerName(props.userDisplayName || '');
      setMaintainerName(props.userDisplayName || '');
      setKeyboardName('');
      setMcuType('development_board');
      setMcu('promicro');
      setVendorId('');
      setProductId('');
      setLayout(DEFAULT_LAYOUT);
      setShowErrors(false);
    }
  }, [props.open, props.userDisplayName]);

  const onChangeMcuType = (event: SelectChangeEvent<MCUType>) => {
    const newMcuType = event.target.value as MCUType;
    setMcuType(newMcuType);
    setMcu(''); // Reset MCU selection when type changes
  };

  const getAvailableMcus = () => {
    if (mcuType === 'development_board') {
      return DEVELOPMENT_BOARD_MCUS;
    } else {
      return INTEGRATED_MCUS;
    }
  };

  // Validation functions
  const validateSingleByteString = (
    value: string,
    maxLength: number
  ): boolean => {
    if (!value || value.trim() === '') return false;
    if (value.length > maxLength) return false;
    // Check for multibyte characters (non-ASCII)
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/.test(value);
  };

  const validateFilename = (value: string, maxLength: number): boolean => {
    if (!value || value.trim() === '') return false;
    if (value.length > maxLength) return false;
    // Check for multibyte characters (non-ASCII)
    // eslint-disable-next-line no-control-regex
    if (!/^[\x00-\x7F]*$/.test(value)) return false;
    // Check for invalid filename characters across Windows, macOS, and Unix
    // eslint-disable-next-line no-control-regex
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    return !invalidChars.test(value);
  };

  const validateHexId = (value: string): boolean => {
    if (!value || value.trim() === '') return false;
    if (value.length > 4) return false;
    // Check if it's a valid hexadecimal string
    return /^[0-9A-Fa-f]+$/.test(value);
  };

  // Validation state
  const manufacturerNameValid = validateSingleByteString(manufacturerName, 256);
  const maintainerNameValid = validateSingleByteString(maintainerName, 256);
  const keyboardNameValid = validateFilename(keyboardName, 256);
  const vendorIdValid = validateHexId(vendorId);
  const productIdValid = validateHexId(productId);
  const mcuValid = mcu.trim() !== '';

  const isFormValid =
    manufacturerNameValid &&
    maintainerNameValid &&
    keyboardNameValid &&
    vendorIdValid &&
    productIdValid &&
    mcuValid;

  // Error message functions
  const getManufacturerNameError = (): string => {
    if (!manufacturerName || manufacturerName.trim() === '')
      return t('This field is required');
    if (manufacturerName.length > 256)
      return t('Maximum 256 characters allowed');
    // eslint-disable-next-line no-control-regex
    if (!/^[\x00-\x7F]*$/.test(manufacturerName))
      return t('Only single-byte characters are allowed');
    return '';
  };

  const getMaintainerNameError = (): string => {
    if (!maintainerName || maintainerName.trim() === '')
      return t('This field is required');
    if (maintainerName.length > 256) return t('Maximum 256 characters allowed');
    // eslint-disable-next-line no-control-regex
    if (!/^[\x00-\x7F]*$/.test(maintainerName))
      return t('Only single-byte characters are allowed');
    return '';
  };

  const getKeyboardNameError = (): string => {
    if (!keyboardName || keyboardName.trim() === '')
      return t('This field is required');
    if (keyboardName.length > 256) return t('Maximum 256 characters allowed');
    // eslint-disable-next-line no-control-regex
    if (!/^[\x00-\x7F]*$/.test(keyboardName))
      return t('Only single-byte characters are allowed');
    // eslint-disable-next-line no-control-regex
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(keyboardName))
      return t('Contains invalid characters for filename');
    return '';
  };

  const getVendorIdError = (): string => {
    if (!vendorId || vendorId.trim() === '') return t('This field is required');
    if (vendorId.length > 4) return t('Maximum 4 characters allowed');
    if (!/^[0-9A-Fa-f]+$/.test(vendorId))
      return t('Only hexadecimal characters (0-9, A-F) are allowed');
    return '';
  };

  const getProductIdError = (): string => {
    if (!productId || productId.trim() === '')
      return t('This field is required');
    if (productId.length > 4) return t('Maximum 4 characters allowed');
    if (!/^[0-9A-Fa-f]+$/.test(productId))
      return t('Only hexadecimal characters (0-9, A-F) are allowed');
    return '';
  };

  const handleGenerateClick = () => {
    setShowErrors(true);
    if (isFormValid) {
      props.onGenerate({
        manufacturerName,
        maintainerName,
        keyboardName,
        mcuType,
        mcu,
        vendorId: vendorId.toUpperCase(),
        productId: productId.toUpperCase(),
        layout,
      });
    }
  };

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle>{t('File Generation')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('Generate keyboard.json and keymap.c files for QMK Firmware')}
        </Typography>

        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            label={t('Manufacturer Name')}
            value={manufacturerName}
            onChange={(e) => setManufacturerName(e.target.value)}
            required
            error={showErrors && !manufacturerNameValid}
            helperText={
              showErrors && !manufacturerNameValid
                ? getManufacturerNameError()
                : ''
            }
          />

          <TextField
            fullWidth
            size="small"
            label={t('Maintainer Name')}
            value={maintainerName}
            onChange={(e) => setMaintainerName(e.target.value)}
            required
            error={showErrors && !maintainerNameValid}
            helperText={
              showErrors && !maintainerNameValid ? getMaintainerNameError() : ''
            }
          />

          <TextField
            fullWidth
            size="small"
            label={t('Keyboard Name')}
            value={keyboardName}
            onChange={(e) => setKeyboardName(e.target.value)}
            required
            error={showErrors && !keyboardNameValid}
            helperText={
              showErrors && !keyboardNameValid ? getKeyboardNameError() : ''
            }
          />

          <FormControl fullWidth size="small" required>
            <InputLabel>{t('MCU Type')}</InputLabel>
            <Select
              value={mcuType}
              label={t('MCU Type')}
              onChange={onChangeMcuType}
            >
              {MCU_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(MCU_TYPE_DISPLAY_NAMES[type])}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
            <InputLabel>{t('MCU')}</InputLabel>
            <Select
              value={mcu}
              label={t('MCU')}
              onChange={(e) => setMcu(e.target.value)}
              disabled={!mcuType}
            >
              {getAvailableMcus().map((mcuOption) => (
                <MenuItem key={mcuOption} value={mcuOption}>
                  {mcuOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label={t('Vendor ID')}
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            placeholder="FEED"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">0x</InputAdornment>
              ),
            }}
            required
            error={showErrors && !vendorIdValid}
            helperText={showErrors && !vendorIdValid ? getVendorIdError() : ''}
          />

          <TextField
            fullWidth
            size="small"
            label={t('Product ID')}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="0000"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">0x</InputAdornment>
              ),
            }}
            required
            error={showErrors && !productIdValid}
            helperText={
              showErrors && !productIdValid ? getProductIdError() : ''
            }
          />

          <FormControl fullWidth size="small">
            <InputLabel>{t('Keyboard Layout')}</InputLabel>
            <Select
              value={layout}
              label={t('Keyboard Layout')}
              onChange={(e) => setLayout(e.target.value)}
            >
              {AVAILABLE_LAYOUTS.map((layoutOption) => (
                <MenuItem key={layoutOption} value={layoutOption}>
                  {layoutOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleGenerateClick} variant="contained">
          {t('Generate')}
        </Button>
        <Button onClick={props.onClose}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
