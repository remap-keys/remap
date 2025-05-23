import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  IBuildableFirmwareFileType,
  IWorkbenchProject,
} from '../../../services/storage/Storage';
import { useForm, Controller, ValidateResult } from 'react-hook-form';
import { t } from 'i18next';

interface CreateNewFileForm {
  fileName: string;
}

type CreateNewWorkbenchProjectFileDialogProps = {
  open: boolean;
  onClose: () => void;
  fileType: IBuildableFirmwareFileType;
  workbenchProject: IWorkbenchProject | undefined;
  onSubmit: (path: string, fileType: IBuildableFirmwareFileType) => void;
};

export function CreateNewWorkbenchProjectFileDialog(
  props: CreateNewWorkbenchProjectFileDialogProps
) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateNewFileForm>({
    values: {
      fileName: '',
    },
  });

  useEffect(() => {
    if (props.open) {
      reset({
        fileName: '',
      });
    }
  }, [props.open, reset]);

  const onSubmit = (data: CreateNewFileForm) => {
    props.onSubmit(data.fileName, props.fileType);
  };

  const validateFileName = (
    value: string,
    fileType: IBuildableFirmwareFileType
  ): ValidateResult => {
    if (props.workbenchProject === undefined) {
      return t('Project not found');
    }
    const files =
      fileType === 'keyboard'
        ? props.workbenchProject.keyboardFiles
        : props.workbenchProject.keymapFiles;
    const fileName = value.trim();
    if (files.map((x) => x.path).includes(fileName)) {
      return t('File name already exists');
    }
    return true;
  };

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t('Create New File')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>{t('Target directory')}:</strong>{' '}
              {props.fileType === 'keyboard'
                ? `Keyboards/${props.workbenchProject?.keyboardDirectoryName || '...'}/`
                : `Keyboards/${props.workbenchProject?.keyboardDirectoryName || '...'}/keymaps/remap/`}
            </Typography>
            <Controller
              name="fileName"
              control={control}
              rules={{
                required: t('File name is required'),
                validate: (value): ValidateResult => {
                  return validateFileName(value, props.fileType);
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('File Name')}
                  size="small"
                  fullWidth
                  error={!!errors.fileName}
                  helperText={errors.fileName ? errors.fileName.message : ''}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit">{t('Create')}</Button>
          <Button onClick={props.onClose}>{t('Close')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
