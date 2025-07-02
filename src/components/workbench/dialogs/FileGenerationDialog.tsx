import React, { useState } from 'react';
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
} from '@mui/material';
import { t } from 'i18next';

// MCU Types
const MCU_TYPES = [
  'A separate development board (ex. Pro Micro)',
  'The microcontroller integrated ont the PCB',
] as const;

type MCUType = (typeof MCU_TYPES)[number];

// MCU Lists
const DEVELOPMENT_BOARD_MCUS = [
  'bit_c_pro',
  'blackpill_f401',
  'blackpill_f411',
  'blok',
  'bluepill',
  'bonsai_c4',
  'elite_c',
  'elite_pi',
  'helios',
  'imera',
  'kb2040',
  'liatris',
  'michi',
  'promicro',
  'promicro_rp2040',
  'proton_c',
  'stemcell',
  'svlinky',
];

const INTEGRATED_MCUS = [
  'AT32F415',
  'at90usb1286',
  'at90usb1287',
  'at90usb162',
  'at90usb646',
  'at90usb647',
  'atmega16u2',
  'atmega16u4',
  'atmega328',
  'atmega328p',
  'atmega32a',
  'atmega32u2',
  'atmega32u4',
  'attiny85',
  'GD32VF103',
  'MK20DX128',
  'MK20DX256',
  'MK64FX512',
  'MK66FX1M0',
  'MKL26Z64',
  'RP2040',
  'STM32F042',
  'STM32F072',
  'STM32F103',
  'STM32F303',
  'STM32F401',
  'STM32F405',
  'STM32F407',
  'STM32F411',
  'STM32F446',
  'STM32G0B1',
  'STM32G431',
  'STM32G474',
  'STM32H723',
  'STM32H733',
  'STM32L412',
  'STM32L422',
  'STM32L432',
  'STM32L433',
  'STM32L442',
  'STM32L443',
  'WB32F3G71',
  'WB32FQ95',
];

interface FileGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
}

export default function FileGenerationDialog(props: FileGenerationDialogProps) {
  const [manufacturerName, setManufacturerName] = useState<string>('');
  const [maintainerName, setMaintainerName] = useState<string>('');
  const [keyboardName, setKeyboardName] = useState<string>('');
  const [mcuType, setMcuType] = useState<MCUType>(MCU_TYPES[0]);
  const [mcu, setMcu] = useState<string>('');
  const [vendorId, setVendorId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');

  const onChangeMcuType = (event: SelectChangeEvent<MCUType>) => {
    const newMcuType = event.target.value as MCUType;
    setMcuType(newMcuType);
    setMcu(''); // Reset MCU selection when type changes
  };

  const getAvailableMcus = () => {
    if (mcuType === MCU_TYPES[0]) {
      return DEVELOPMENT_BOARD_MCUS;
    } else {
      return INTEGRATED_MCUS;
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
          />

          <TextField
            fullWidth
            size="small"
            label={t('Maintainer Name')}
            value={maintainerName}
            onChange={(e) => setMaintainerName(e.target.value)}
            required
          />

          <TextField
            fullWidth
            size="small"
            label={t('Keyboard Name')}
            value={keyboardName}
            onChange={(e) => setKeyboardName(e.target.value)}
            required
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
                  {t(type)}
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
            placeholder="0x1234"
            required
          />

          <TextField
            fullWidth
            size="small"
            label={t('Product ID')}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="0x5678"
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onGenerate} variant="contained">
          {t('Generate')}
        </Button>
        <Button onClick={props.onClose}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
