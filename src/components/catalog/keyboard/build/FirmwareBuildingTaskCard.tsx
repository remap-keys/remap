import {
  IBuildableFirmwareFile,
  IBuildableFirmwareFileType,
  IFirmwareBuildingTask,
} from '../../../../services/storage/Storage';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Step,
  StepLabel,
  Stepper,
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
import moment from 'moment/moment';

type ParameterNameValueMap = {
  [parameterName: string]: string;
};

type ParametersJsonVersion1 = {
  keyboard: { [fileId: string]: ParameterNameValueMap };
  keymap: { [fileId: string]: ParameterNameValueMap };
};

type ParametersJsonVersion2 = {
  version: number;
  keyboard: {
    [fileId: string]: {
      type: string;
      parameters?: ParameterNameValueMap;
      code?: string;
    };
  };
  keymap: {
    [fileId: string]: {
      type: string;
      parameters?: ParameterNameValueMap;
      code?: string;
    };
  };
};

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

export function FirmwareBuildingTaskCard(props: FirmwareBuildingTaskCardProps) {
  const [description, setDescription] = useState<string>(
    props.task.description
  );
  const [logTabIndex, setLogTabIndex] = useState<number>(0);
  const [selectedBuildCodeIndex, setSelectedBuildCodeIndex] = useState<
    number | undefined
  >(undefined);

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
    keyboard: { [fileId: string]: ParameterNameValueMap };
    keymap: { [fileId: string]: ParameterNameValueMap };
  } => {
    const json = JSON.parse(parametersJson);
    if (json.version && json.version === 2) {
      const values = json as ParametersJsonVersion2;
      return {
        keyboard: Object.entries(values.keyboard).reduce<{
          [fileId: string]: ParameterNameValueMap;
        }>((result, [fileId, value]) => {
          if (value.type === 'parameters') {
            result[fileId] = value.parameters!;
          }
          return result;
        }, {}),
        keymap: Object.entries(values.keymap).reduce<{
          [fileId: string]: ParameterNameValueMap;
        }>((result, [fileId, value]) => {
          if (value.type === 'parameters') {
            result[fileId] = value.parameters!;
          }
          return result;
        }, {}),
      };
    } else {
      return json as ParametersJsonVersion1;
    }
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

  const createBuildableFirmwareFileNameCodeMap = (
    parametersJson: string
  ): {
    keyboard: { [fileId: string]: string };
    keymap: { [fileId: string]: string };
  } => {
    const json = JSON.parse(parametersJson);
    if (json.version && json.version === 2) {
      const values = json as ParametersJsonVersion2;
      return {
        keyboard: Object.entries(values.keyboard).reduce<{
          [fileId: string]: string;
        }>((result, [fileId, value]) => {
          if (value.type === 'code') {
            result[fileId] = value.code!;
          }
          return result;
        }, {}),
        keymap: Object.entries(values.keymap).reduce<{
          [fileId: string]: string;
        }>((result, [fileId, value]) => {
          if (value.type === 'code') {
            result[fileId] = value.code!;
          }
          return result;
        }, {}),
      };
    } else {
      // The version 1 does not have code.
      return {
        keyboard: {},
        keymap: {},
      };
    }
  };

  const createBuildableFirmwareFileCodes = (
    parametersJson: string
  ): {
    type: IBuildableFirmwareFileType;
    file: IBuildableFirmwareFile;
    code: string;
  }[] => {
    const nameCodeMap = createBuildableFirmwareFileNameCodeMap(parametersJson);
    const result: {
      type: IBuildableFirmwareFileType;
      file: IBuildableFirmwareFile;
      code: string;
    }[] = [];
    Object.entries(nameCodeMap.keyboard).forEach(([fileId, code]) => {
      result.push({
        type: 'keyboard',
        file: props.buildableFirmwareKeyboardFiles.find(
          (file) => file.id === fileId
        )!,
        code,
      });
    });
    Object.entries(nameCodeMap.keymap).forEach(([fileId, code]) => {
      result.push({
        type: 'keymap',
        file: props.buildableFirmwareKeymapFiles.find(
          (file) => file.id === fileId
        )!,
        code,
      });
    });
    return result;
  };

  const buildCodeArray = createBuildableFirmwareFileCodes(
    props.task.parametersJson
  );

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
            <Tab label="Build Codes" />
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
            <Box
              sx={{
                height: '148px',
                mt: 1,
                display: 'grid',
                gridTemplateColumns: '2fr 5fr',
              }}
            >
              <Paper variant="outlined">
                <List
                  component="nav"
                  sx={{ height: '148px', overflowY: 'auto' }}
                >
                  {buildCodeArray.map((entry, index) => (
                    <ListItemButton
                      key={`buildable-firmware-code-${index}`}
                      onClick={() => {
                        setSelectedBuildCodeIndex(index);
                      }}
                      selected={selectedBuildCodeIndex === index}
                    >
                      <ListItemText
                        primary={`${
                          entry.type === 'keyboard' ? 'Keyboard' : 'Keymap'
                        }: ${entry.file.path}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
              <TextField
                multiline
                rows={5}
                value={
                  selectedBuildCodeIndex !== undefined
                    ? buildCodeArray[selectedBuildCodeIndex].code
                    : ''
                }
                sx={{ ml: '8px' }}
                fullWidth
                variant="outlined"
                inputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          ) : logTabIndex === 2 ? (
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
