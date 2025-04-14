import React from 'react';
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
  IWorkbenchProjectFile,
} from '../../../services/storage/Storage';
import { useForm, Controller, ValidateResult } from 'react-hook-form';

interface EditFileForm {
  fileName: string;
}

type EditWorkbenchProjectFileDialogProps = {
  open: boolean;
  onClose: () => void;
  file: IWorkbenchProjectFile | undefined;
  fileType: IBuildableFirmwareFileType;
  workbenchProject: IWorkbenchProject | undefined;
  onSubmit: (
    path: string,
    file: IWorkbenchProjectFile | undefined,
    fileType: IBuildableFirmwareFileType
  ) => void;
  onDelete: (
    file: IWorkbenchProjectFile | undefined,
    fileType: IBuildableFirmwareFileType
  ) => void;
};

export function EditWorkbenchProjectFileDialog(
  props: EditWorkbenchProjectFileDialogProps
) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFileForm>({
    values: {
      fileName: props.file?.path || '',
    },
  });

  const onSubmit = (data: EditFileForm) => {
    props.onSubmit(data.fileName, props.file, props.fileType);
  };

  const validateFileName = (
    value: string,
    fileType: IBuildableFirmwareFileType
  ): ValidateResult => {
    if (props.workbenchProject === undefined) {
      return 'Project not found';
    }
    const files =
      fileType === 'keyboard'
        ? props.workbenchProject.keyboardFiles
        : props.workbenchProject.keymapFiles;
    const fileName = value.trim();
    if (
      files
        .filter((x) => x.id !== props.file?.id)
        .map((x) => x.path)
        .includes(fileName)
    ) {
      return 'File name already exists';
    }
    return true;
  };

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Edit File</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Target directory:</strong>{' '}
              {props.fileType === 'keyboard'
                ? 'Keyboards/.../'
                : 'Keyboards/.../keymaps/.../'}
            </Typography>
            <Controller
              name="fileName"
              control={control}
              rules={{
                required: 'File name is required',
                validate: (value): ValidateResult => {
                  return validateFileName(value, props.fileType);
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="File Name"
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
          <Button
            color="warning"
            onClick={() => {
              props.onDelete(props.file, props.fileType);
              props.onClose();
            }}
          >
            Delete
          </Button>
          <Button type="submit">Edit</Button>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
