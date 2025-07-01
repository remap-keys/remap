import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  IBuildableFirmwareQmkFirmwareVersion,
  BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION,
} from '../../../services/storage/Storage';
import { useForm, Controller, ValidateResult, useWatch } from 'react-hook-form';
import { t } from 'i18next';

// Generate default project name following the same logic as workbench.action.ts
const createDefaultProjectName = (existingProjectNames: string[]): string => {
  const label = 'New Project';
  const numbers = existingProjectNames.reduce<Set<number>>((result, name) => {
    const regexp = new RegExp(`^${label} ([0-9]+)$`, 'i');
    const m = name.trim().match(regexp);
    if (m) {
      result.add(Number(m[1]));
    }
    return result;
  }, new Set<number>());
  if (numbers.size === 0) {
    return `${label} 1`;
  }
  let max = 0;
  for (const x of numbers.values()) {
    max = Math.max(max, x);
  }
  return `${label} ${max + 1}`;
};

// MCU Type definitions
type McuType = 'development_board' | 'integrated_mcu';

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
] as const;

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
] as const;

type DevelopmentBoardMcu = (typeof DEVELOPMENT_BOARD_MCUS)[number];
type IntegratedMcu = (typeof INTEGRATED_MCUS)[number];

interface CreateNewProjectForm {
  projectName: string;
  qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion;
  keyboardDirectoryName: string;
  createTemplateFiles: boolean;
  keyboardName: string;
  maintainer: string;
  manufacturer: string;
  mcuType: McuType;
  mcu: string;
}

type CreateNewWorkbenchProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    projectName: string,
    qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion,
    keyboardDirectoryName: string,
    createTemplateFiles: boolean,
    keyboardInfo?: {
      keyboardName: string;
      maintainer: string;
      manufacturer: string;
      mcuType: McuType;
      mcu: string;
    }
  ) => void;
  existingProjectNames: string[];
};

export function CreateNewWorkbenchProjectDialog(
  props: CreateNewWorkbenchProjectDialogProps
) {
  const defaultProjectName = createDefaultProjectName(
    props.existingProjectNames
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateNewProjectForm>({
    values: {
      projectName: defaultProjectName,
      qmkFirmwareVersion: '0.28.3',
      keyboardDirectoryName: '',
      createTemplateFiles: false,
      keyboardName: '',
      maintainer: '',
      manufacturer: '',
      mcuType: 'development_board',
      mcu: 'promicro',
    },
  });

  useEffect(() => {
    if (props.open) {
      const newDefaultProjectName = createDefaultProjectName(
        props.existingProjectNames
      );
      reset({
        projectName: newDefaultProjectName,
        qmkFirmwareVersion: '0.28.3',
        keyboardDirectoryName: '',
        createTemplateFiles: false,
        keyboardName: '',
        maintainer: '',
        manufacturer: '',
        mcuType: 'development_board',
        mcu: 'promicro',
      });
    }
  }, [props.open, props.existingProjectNames, reset]);

  const onSubmit = (data: CreateNewProjectForm) => {
    const keyboardInfo = data.createTemplateFiles
      ? {
          keyboardName: data.keyboardName,
          maintainer: data.maintainer,
          manufacturer: data.manufacturer,
          mcuType: data.mcuType,
          mcu: data.mcu,
        }
      : undefined;

    props.onSubmit(
      data.projectName,
      data.qmkFirmwareVersion,
      data.keyboardDirectoryName,
      data.createTemplateFiles,
      keyboardInfo
    );
  };

  const validateProjectName = (value: string): ValidateResult => {
    const projectName = value.trim();
    if (!projectName) {
      return t('Project name is required');
    }
    if (props.existingProjectNames.includes(projectName)) {
      return t('Project name already exists');
    }
    return true;
  };

  const validateKeyboardDirectoryName = (value: string): ValidateResult => {
    const directoryName = value.trim();
    if (!directoryName) {
      return true; // Optional field
    }
    // Basic validation for directory name
    if (!/^[a-zA-Z0-9_-]+$/.test(directoryName)) {
      return t(
        'Directory name can only contain letters, numbers, hyphens, and underscores'
      );
    }
    return true;
  };

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t('Create New Project')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t(
                'Create a new firmware workbench project to customize your keyboard firmware.'
              )}
            </Typography>

            <Controller
              name="projectName"
              control={control}
              rules={{
                required: t('Project name is required'),
                validate: validateProjectName,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('Project Name')}
                  size="small"
                  fullWidth
                  required
                  error={!!errors.projectName}
                  helperText={
                    errors.projectName ? errors.projectName.message : ''
                  }
                />
              )}
            />

            <Controller
              name="qmkFirmwareVersion"
              control={control}
              rules={{
                required: t('QMK firmware version is required'),
              }}
              render={({ field }) => (
                <FormControl fullWidth size="small" required>
                  <InputLabel>{t('QMK Firmware Version')}</InputLabel>
                  <Select
                    {...field}
                    label={t('QMK Firmware Version')}
                    error={!!errors.qmkFirmwareVersion}
                  >
                    {BUILDABLE_FIRMWARE_QMK_FIRMWARE_VERSION.map((version) => (
                      <MenuItem key={version} value={version}>
                        {version}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.qmkFirmwareVersion && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.qmkFirmwareVersion.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="keyboardDirectoryName"
              control={control}
              rules={{
                validate: validateKeyboardDirectoryName,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('Keyboard Directory Name')}
                  size="small"
                  fullWidth
                  error={!!errors.keyboardDirectoryName}
                  helperText={
                    errors.keyboardDirectoryName
                      ? errors.keyboardDirectoryName.message
                      : t(
                          'Optional: The name of the keyboard directory in QMK firmware (e.g., "my_keyboard")'
                        )
                  }
                />
              )}
            />

            <Controller
              name="createTemplateFiles"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label={t('Create template files for a new keyboard')}
                />
              )}
            />

            {useWatch({ control, name: 'createTemplateFiles' }) && (
              <>
                <Controller
                  name="keyboardName"
                  control={control}
                  rules={{
                    required: t('Keyboard name is required'),
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Keyboard Name')}
                      size="small"
                      fullWidth
                      required
                      error={!!errors.keyboardName}
                      helperText={
                        errors.keyboardName
                          ? errors.keyboardName.message
                          : t(
                              'Display name for your keyboard (e.g., "My Custom Keyboard")'
                            )
                      }
                    />
                  )}
                />

                <Controller
                  name="maintainer"
                  control={control}
                  rules={{
                    required: t('Maintainer name is required'),
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Maintainer')}
                      size="small"
                      fullWidth
                      required
                      error={!!errors.maintainer}
                      helperText={
                        errors.maintainer
                          ? errors.maintainer.message
                          : t('Your name or GitHub username')
                      }
                    />
                  )}
                />

                <Controller
                  name="manufacturer"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('Manufacturer')}
                      size="small"
                      fullWidth
                      error={!!errors.manufacturer}
                      helperText={t('Optional: Company or brand name')}
                    />
                  )}
                />

                <Controller
                  name="mcuType"
                  control={control}
                  rules={{
                    required: t('MCU type is required'),
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" required>
                      <InputLabel>{t('MCU Type')}</InputLabel>
                      <Select
                        {...field}
                        label={t('MCU Type')}
                        error={!!errors.mcuType}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          // Reset MCU selection when type changes
                          if (e.target.value === 'development_board') {
                            setValue('mcu', 'promicro');
                          } else {
                            setValue('mcu', 'atmega32u4');
                          }
                        }}
                      >
                        <MenuItem value="development_board">
                          {t('A separate development board (ex. Pro Micro)')}
                        </MenuItem>
                        <MenuItem value="integrated_mcu">
                          {t('The microcontroller integrated on the PCB')}
                        </MenuItem>
                      </Select>
                      {errors.mcuType && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          {errors.mcuType.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name="mcu"
                  control={control}
                  rules={{
                    required: t('MCU is required'),
                  }}
                  render={({ field }) => {
                    const mcuType = useWatch({ control, name: 'mcuType' });
                    const mcuOptions =
                      mcuType === 'development_board'
                        ? DEVELOPMENT_BOARD_MCUS
                        : INTEGRATED_MCUS;

                    return (
                      <FormControl fullWidth size="small" required>
                        <InputLabel>{t('MCU')}</InputLabel>
                        <Select
                          {...field}
                          label={t('MCU')}
                          error={!!errors.mcu}
                        >
                          {mcuOptions.map((mcu) => (
                            <MenuItem key={mcu} value={mcu}>
                              {mcu}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.mcu && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 1 }}
                          >
                            {errors.mcu.message}
                          </Typography>
                        )}
                      </FormControl>
                    );
                  }}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>{t('Cancel')}</Button>
          <Button type="submit" variant="contained">
            {t('Create Project')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
