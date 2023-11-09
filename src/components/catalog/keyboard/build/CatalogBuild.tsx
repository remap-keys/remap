import React, { useState } from 'react';
import './CatalogBuild.scss';
import {
  CatalogBuildActionsType,
  CatalogBuildStateType,
} from './CatalogBuild.container';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import moment from 'moment';
import {
  IBuildableFirmwareFile,
  IFirmwareBuildingTask,
} from '../../../../services/storage/Storage';
import { sendEventToGoogleAnalytics } from '../../../../utils/GoogleAnalytics';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BuildParametersDialog from './BuildParametersDialog.container';
import {
  IBuildableFirmwareCodeParameterValue,
  IBuildableFirmwareCodeParameterValueMap,
  IBuildableFirmwareCodeParameterValues,
} from '../../../../store/state';
import { extractBuildableFirmwareCodeParameters } from '../../../../services/build/FirmwareCodeParser';
import ConfirmDialog from '../../../common/confirm/ConfirmDialog';

type OwnProps = {};
type CatalogBuildProps = OwnProps &
  Partial<CatalogBuildActionsType> &
  Partial<CatalogBuildStateType>;

export default function CatalogBuild(props: CatalogBuildProps) {
  const [openBuildParametersDialog, setOpenBuildParametersDialog] =
    useState<boolean>(false);
  const [targetDeleteTask, setTargetDeleteTask] =
    useState<IFirmwareBuildingTask | null>(null);

  const createDefaultParameterValues = (
    files: IBuildableFirmwareFile[]
  ): IBuildableFirmwareCodeParameterValueMap => {
    return files.reduce<IBuildableFirmwareCodeParameterValueMap>(
      (valueMap, file) => {
        const parameters = extractBuildableFirmwareCodeParameters(file.content);
        valueMap[file.id] = parameters.reduce<{
          [parameterName: string]: IBuildableFirmwareCodeParameterValue;
        }>((values, parameter) => {
          values[parameter.name] = {
            value: parameter.default,
            definition: parameter,
          };
          return values;
        }, {});
        return valueMap;
      },
      {}
    );
  };

  const onClickBuild = () => {
    const parameterValues: IBuildableFirmwareCodeParameterValues = {
      keyboard: createDefaultParameterValues(
        props.buildableFirmwareKeyboardFiles!
      ),
      keymap: createDefaultParameterValues(props.buildableFirmwareKeymapFiles!),
    };
    props.updateBuildableFirmwareCodeParameterValues!(parameterValues);
    setOpenBuildParametersDialog(true);
  };

  const onClickDownload = (task: IFirmwareBuildingTask) => {
    sendEventToGoogleAnalytics('catalog/build/download_firmware', {
      vendor_id: props.definitionDocument!.vendorId,
      product_id: props.definitionDocument!.productId,
      product_name: props.definitionDocument!.productName,
    });
    props.fetchBuiltFirmwareFileBlob!(task.firmwareFilePath, (blob: any) => {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.download = `${task.id}-remap.${task.firmwareFilePath.substring(
        task.firmwareFilePath.lastIndexOf('.') + 1
      )}`;
      a.href = downloadUrl;
      a.click();
      a.remove();
    });
  };

  const onClickReload = () => {
    props.updateFirmwareBuildingTasks!(props.definitionDocument!.id);
  };

  const onClickFlash = (task: IFirmwareBuildingTask) => {
    props.flashFirmware!(props.definitionDocument!, task);
  };

  const onClickDelete = (task: IFirmwareBuildingTask) => {
    setTargetDeleteTask(task);
  };

  const onClickDeleteYes = () => {
    props.deleteFirmwareBuildingTask!(
      props.definitionDocument!.id,
      targetDeleteTask!
    );
    setTargetDeleteTask(null);
  };

  const onClickDeleteNo = () => {
    setTargetDeleteTask(null);
  };

  const onClickCloseBuildParametersDialog = () => {
    setOpenBuildParametersDialog(false);
  };

  const createBuildableFirmwareCodeParameterNameValueMap = (
    valueMap: IBuildableFirmwareCodeParameterValueMap
  ): { [fileId: string]: { [parameterName: string]: string } } => {
    return Object.entries(valueMap).reduce<{
      [fileId: string]: { [parameterName: string]: string };
    }>((result, [fileId, valueMap]) => {
      result[fileId] = Object.entries(valueMap).reduce<{
        [parameterName: string]: string;
      }>((result, [parameterName, parameterValue]) => {
        result[parameterName] = parameterValue.value;
        return result;
      }, {});
      return result;
    }, {});
  };

  const onClickBuildBuildParametersDialog = (description: string) => {
    setOpenBuildParametersDialog(false);
    const parameterValues: {
      keyboard: { [fileId: string]: { [parameterName: string]: string } };
      keymap: { [fileId: string]: { [parameterName: string]: string } };
    } = {
      keyboard: createBuildableFirmwareCodeParameterNameValueMap(
        props.buildableFirmwareCodeParameterValues!.keyboard
      ),
      keymap: createBuildableFirmwareCodeParameterNameValueMap(
        props.buildableFirmwareCodeParameterValues!.keymap
      ),
    };
    props.createFirmwareBuildingTask!(
      props.definitionDocument!.id,
      description,
      JSON.stringify(parameterValues)
    );
  };

  const onChangeDescription = (
    task: IFirmwareBuildingTask,
    description: string
  ) => {
    if (task.description !== description) {
      props.updateFirmwareBuildingTaskDescription!(task.id, description);
    }
  };

  return (
    <div className="catalog-build-container">
      <React.Fragment>
        <Paper sx={{ p: '16px', mb: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              sx={{ mr: '32px' }}
              onClick={onClickReload}
              disabled={!props.signedIn}
            >
              Reload
            </Button>
            <Button
              variant="contained"
              onClick={onClickBuild}
              disabled={
                !props.signedIn ||
                props.buildableFirmware == null ||
                !props.buildableFirmware.enabled
              }
            >
              Build Firmware
            </Button>
          </Box>
        </Paper>
        {props.signedIn && (
          <Box sx={{ mb: '32px' }}>
            {props.firmwareBuildingTasks!.map((task) => (
              <FirmwareBuildingTaskCard
                key={`firmware-building-task-${task.id}`}
                task={task}
                onClickDownload={onClickDownload}
                onClickDelete={onClickDelete}
                onClickFlash={onClickFlash}
                onChangeDescription={onChangeDescription}
              />
            ))}
          </Box>
        )}
        <BuildParametersDialog
          open={openBuildParametersDialog}
          onClickClose={onClickCloseBuildParametersDialog}
          onClickBuild={onClickBuildBuildParametersDialog}
        />
        <ConfirmDialog
          open={targetDeleteTask != null}
          title="Delete the task"
          message="Are you sure to delete the task?"
          onClickYes={onClickDeleteYes}
          onClickNo={onClickDeleteNo}
        />
      </React.Fragment>
    </div>
  );
}

type FirmwareBuildingTaskCardProps = {
  task: IFirmwareBuildingTask;
  // eslint-disable-next-line no-unused-vars
  onClickDownload: (task: IFirmwareBuildingTask) => void;
  // eslint-disable-next-line no-unused-vars
  onClickFlash: (task: IFirmwareBuildingTask) => void;
  // eslint-disable-next-line no-unused-vars
  onClickDelete: (task: IFirmwareBuildingTask) => void;
  onChangeDescription: (
    // eslint-disable-next-line no-unused-vars
    task: IFirmwareBuildingTask,
    // eslint-disable-next-line no-unused-vars
    description: string
  ) => void;
};

function FirmwareBuildingTaskCard(props: FirmwareBuildingTaskCardProps) {
  const [description, setDescription] = useState<string>(
    props.task.description
  );

  const isTaskCompleted = (task: IFirmwareBuildingTask): boolean => {
    return task.status === 'success' || task.status === 'failure';
  };

  const createActiveStepNumber = (task: IFirmwareBuildingTask): number => {
    return task.status === 'waiting' ? 0 : task.status === 'building' ? 1 : 2;
  };

  return (
    <React.Fragment>
      <Card sx={{ mb: isTaskCompleted(props.task) ? '0' : '32px' }}>
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
            }}
          >
            <Typography variant="subtitle1">
              Task ID: {props.task.id}
            </Typography>
            <Typography variant="subtitle1">
              Created at:{' '}
              {moment(props.task.createdAt).format('YYYY-MM-DD hh:mm:ss')}
            </Typography>
            <Typography variant="subtitle1">
              Updated at:{' '}
              {moment(props.task.updatedAt).format('YYYY-MM-DD hh:mm:ss')}
            </Typography>
          </Box>
          <Stepper
            nonLinear
            activeStep={createActiveStepNumber(props.task)}
            sx={{ m: '16px 128px 0 128px' }}
          >
            <Step
              key={`firmware-building-task-${props.task.id}-waiting`}
              completed={props.task.status !== 'waiting'}
            >
              <StepLabel>Waiting</StepLabel>
            </Step>
            <Step
              key={`firmware-building-task-${props.task.id}-building`}
              completed={isTaskCompleted(props.task)}
            >
              <StepLabel>Building</StepLabel>
            </Step>
            {props.task.status === 'success' ? (
              <Step
                key={`firmware-building-task-${props.task.id}-success`}
                completed={true}
              >
                <StepLabel>Success</StepLabel>
              </Step>
            ) : props.task.status === 'failure' ? (
              <Step key={`firmware-building-task-${props.task.id}-failure`}>
                <StepLabel error={true}>Failure</StepLabel>
              </Step>
            ) : (
              <Step key={`firmware-building-task-${props.task.id}-completed`}>
                <StepLabel>Completed</StepLabel>
              </Step>
            )}
          </Stepper>
          <Box>
            <TextField
              variant="standard"
              label="Memorandum"
              value={description}
              fullWidth
              sx={{ mt: 1 }}
              size="small"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              onBlur={() => {
                props.onChangeDescription(props.task, description);
              }}
            />
          </Box>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          {props.task.status === 'success' && (
            <Button
              variant="text"
              onClick={() => {
                props.onClickDownload(props.task);
              }}
            >
              Download
            </Button>
          )}
          {props.task.status === 'success' && (
            <Button
              variant="text"
              onClick={() => {
                props.onClickFlash(props.task);
              }}
            >
              Flash
            </Button>
          )}
          {isTaskCompleted(props.task) && (
            <Button
              variant="text"
              onClick={() => {
                props.onClickDelete(props.task);
              }}
            >
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
      {isTaskCompleted(props.task) && (
        <Accordion sx={{ mb: '32px', mt: '8px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Logs - {props.task.id}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2">Standard Output</Typography>
                <TextField
                  multiline
                  rows={5}
                  value={props.task.stdout}
                  sx={{ mt: '8px' }}
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2">Standard Error</Typography>
                <TextField
                  multiline
                  rows={5}
                  value={props.task.stderr}
                  sx={{ mt: '8px' }}
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </React.Fragment>
  );
}
