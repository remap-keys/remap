import React, { useEffect, useRef, useState } from 'react';
import './CatalogBuild.scss';
import {
  CatalogBuildActionsType,
  CatalogBuildStateType,
} from './CatalogBuild.container';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import moment from 'moment';
import {
  IBuildableFirmwareFile,
  IBuildableFirmwareFileType,
  IFirmwareBuildingTask,
} from '../../../../services/storage/Storage';
import { sendEventToGoogleAnalytics } from '../../../../utils/GoogleAnalytics';
import BuildParametersDialog from './BuildParametersDialog.container';
import {
  IBuildableFirmwareCodeParameterValue,
  IBuildableFirmwareCodeParameterValueMap,
  IBuildableFirmwareCodeParameterValues,
} from '../../../../store/state';
import {
  extractBuildableFirmwareCodeParameters,
  replaceBuildableFirmwareCodeWithParameterDefaultValues,
} from '../../../../services/build/FirmwareCodeParser';
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
  const [autoReload, setAutoReload] = useState<boolean>(false);
  const autoStopRef = useRef<number | null>(null);

  const autoReloadRef = useRef<number | null>(null);
  useEffect(() => {
    if (autoReload) {
      if (autoReloadRef.current !== null) return;
      const reload = () => {
        props.updateFirmwareBuildingTasks!(props.definitionDocument!.id);
        autoReloadRef.current = window.setTimeout(reload, 30000);
      };
      reload();
      autoStopRef.current = window.setTimeout(() => {
        setAutoReload(false);
      }, 180000);
    } else {
      if (autoReloadRef.current !== null) {
        window.clearTimeout(autoReloadRef.current);
        autoReloadRef.current = null;
      }
      if (autoStopRef.current !== null) {
        window.clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
    }
    return () => {
      if (autoReloadRef.current !== null) {
        window.clearTimeout(autoReloadRef.current);
        autoReloadRef.current = null;
      }
      if (autoStopRef.current !== null) {
        window.clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
    };
  }, [autoReload]);

  const createDefaultParameterValues = (
    files: IBuildableFirmwareFile[]
  ): IBuildableFirmwareCodeParameterValueMap => {
    return files.reduce<IBuildableFirmwareCodeParameterValueMap>(
      (valueMap, file) => {
        const parameters = extractBuildableFirmwareCodeParameters(file.content);
        if (!valueMap[file.id]) {
          valueMap[file.id] = {
            type: 'parameters',
            parameters: {},
            code: replaceBuildableFirmwareCodeWithParameterDefaultValues(
              file.content,
              parameters
            ),
          };
        }
        valueMap[file.id].parameters = parameters.reduce<{
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
    sendEventToGoogleAnalytics('catalog/build/flash_firmware', {
      vendor_id: props.definitionDocument!.vendorId,
      product_id: props.definitionDocument!.productId,
      product_name: props.definitionDocument!.productName,
    });
    props.flashFirmware!(
      props.definitionDocument!,
      props.buildableFirmware!,
      task
    );
  };

  const onClickDelete = (task: IFirmwareBuildingTask) => {
    setTargetDeleteTask(task);
  };

  const onClickDeleteYes = () => {
    sendEventToGoogleAnalytics('catalog/build/delete_firmware', {
      vendor_id: props.definitionDocument!.vendorId,
      product_id: props.definitionDocument!.productId,
      product_name: props.definitionDocument!.productName,
    });
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
  ): {
    [fileId: string]: {
      type: string;
      parameters?: { [parameterName: string]: string };
      code?: string;
    };
  } => {
    return Object.entries(valueMap).reduce<{
      [fileId: string]: {
        type: string;
        parameters?: { [parameterName: string]: string };
        code?: string;
      };
    }>((result, [fileId, valueMap]) => {
      if (valueMap.type === 'code') {
        result[fileId] = { type: 'code', code: valueMap.code };
        return result;
      } else {
        result[fileId] = {
          type: 'parameters',
          parameters: Object.entries(valueMap.parameters).reduce<{
            [parameterName: string]: string;
          }>((result, [parameterName, parameterValue]) => {
            result[parameterName] = parameterValue.value;
            return result;
          }, {}),
        };
        return result;
      }
    }, {});
  };

  const onClickBuildBuildParametersDialog = (description: string) => {
    sendEventToGoogleAnalytics('catalog/build/build_firmware', {
      vendor_id: props.definitionDocument!.vendorId,
      product_id: props.definitionDocument!.productId,
      product_name: props.definitionDocument!.productName,
    });
    setOpenBuildParametersDialog(false);
    const parameterValues: {
      version: number;
      keyboard: {
        [fileId: string]: {
          type: string;
          parameters?: { [parameterName: string]: string };
          code?: string;
        };
      };
      keymap: {
        [fileId: string]: {
          type: string;
          parameters?: { [parameterName: string]: string };
          code?: string;
        };
      };
    } = {
      version: 2,
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
      sendEventToGoogleAnalytics('catalog/build/change_description', {
        vendor_id: props.definitionDocument!.vendorId,
        product_id: props.definitionDocument!.productId,
        product_name: props.definitionDocument!.productName,
      });
      props.updateFirmwareBuildingTaskDescription!(task.id, description);
    }
  };

  const onChangeAutoReload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoReload(event.target.checked);
  };

  return (
    <div className="catalog-build-container">
      <React.Fragment>
        <Paper sx={{ p: '16px', mb: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              control={
                <Switch checked={autoReload} onChange={onChangeAutoReload} />
              }
              label="Auto"
            />
            <Button
              variant="outlined"
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
                buildableFirmwareKeyboardFiles={
                  props.buildableFirmwareKeyboardFiles!
                }
                buildableFirmwareKeymapFiles={
                  props.buildableFirmwareKeymapFiles!
                }
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
  buildableFirmwareKeyboardFiles: IBuildableFirmwareFile[];
  buildableFirmwareKeymapFiles: IBuildableFirmwareFile[];
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
  const [logTabIndex, setLogTabIndex] = useState<number>(0);

  const isTaskCompleted = (task: IFirmwareBuildingTask): boolean => {
    return task.status === 'success' || task.status === 'failure';
  };

  const createActiveStepNumber = (task: IFirmwareBuildingTask): number => {
    return task.status === 'waiting' ? 0 : task.status === 'building' ? 1 : 2;
  };

  const onLogTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setLogTabIndex(newValue);
  };

  const createBuildableFirmwareFileParameterNameValueMap = (
    parametersJson: string
  ): {
    keyboard: { [fileId: string]: { [parameterName: string]: string } };
    keymap: { [fileId: string]: { [parameterName: string]: string } };
  } => {
    return JSON.parse(parametersJson) as {
      keyboard: { [fileId: string]: { [parameterName: string]: string } };
      keymap: { [fileId: string]: { [parameterName: string]: string } };
    };
  };

  const createBuildableFirmwareFileParameterValues = (
    parametersJson: string
  ): {
    type: IBuildableFirmwareFileType;
    file: IBuildableFirmwareFile;
    parameterName: string;
    parameterValue: string;
  }[] => {
    const nameValueMap =
      createBuildableFirmwareFileParameterNameValueMap(parametersJson);
    const result: {
      type: IBuildableFirmwareFileType;
      file: IBuildableFirmwareFile;
      parameterName: string;
      parameterValue: string;
    }[] = [];
    Object.entries(nameValueMap.keyboard).forEach(([fileId, nameValueMap]) => {
      Object.entries(nameValueMap).forEach(
        ([parameterName, parameterValue]) => {
          result.push({
            type: 'keyboard',
            file: props.buildableFirmwareKeyboardFiles.find(
              (file) => file.id === fileId
            )!,
            parameterName,
            parameterValue,
          });
        }
      );
    });
    Object.entries(nameValueMap.keymap).forEach(([fileId, nameValueMap]) => {
      Object.entries(nameValueMap).forEach(
        ([parameterName, parameterValue]) => {
          result.push({
            type: 'keymap',
            file: props.buildableFirmwareKeymapFiles.find(
              (file) => file.id === fileId
            )!,
            parameterName,
            parameterValue,
          });
        }
      );
    });
    return result;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          <Typography variant="subtitle1">Task ID: {props.task.id}</Typography>
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
        <Box sx={{ mb: 1 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Tabs value={logTabIndex} onChange={onLogTabChange}>
            <Tab label="Build Parameters" />
            {isTaskCompleted(props.task) && [
              <Tab label="Standard Output" key={`${props.task.id}-stdout}`} />,
              <Tab label="Standard Error" key={`${props.task.id}-stderr}`} />,
            ]}
          </Tabs>
          {logTabIndex === 0 ? (
            <TableContainer sx={{ height: '148px', mt: 1 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File</TableCell>
                    <TableCell>Parameter</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {createBuildableFirmwareFileParameterValues(
                    props.task.parametersJson
                  ).map((parameterValue, index) => (
                    <TableRow key={`parameter-value-${index}`}>
                      <TableCell>{`${parameterValue.type}: ${parameterValue.file.path}`}</TableCell>
                      <TableCell>{parameterValue.parameterName}</TableCell>
                      <TableCell>{parameterValue.parameterValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : logTabIndex === 1 ? (
            <TextField
              multiline
              rows={5}
              value={props.task.stdout}
              sx={{ mt: '8px' }}
              fullWidth
              variant="outlined"
            />
          ) : (
            <TextField
              multiline
              rows={5}
              value={props.task.stderr}
              sx={{ mt: '8px' }}
              fullWidth
              variant="outlined"
            />
          )}
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
  );
}
