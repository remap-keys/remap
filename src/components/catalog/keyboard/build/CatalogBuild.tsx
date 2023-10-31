import React from 'react';
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
import ConfirmDialog from '../../../common/confirm/ConfirmDialog';
import moment from 'moment';
import { IFirmwareBuildingTask } from '../../../../services/storage/Storage';
import { sendEventToGoogleAnalytics } from '../../../../utils/GoogleAnalytics';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type OwnProps = {};
type CatalogBuildProps = OwnProps &
  Partial<CatalogBuildActionsType> &
  Partial<CatalogBuildStateType>;

export default function CatalogBuild(props: CatalogBuildProps) {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const onClickConfirmDialogYes = () => {
    setOpenConfirmDialog(false);
    props.createFirmwareBuildingTask!(props.definitionDocument!.id);
  };

  const onClickConfirmDialogNo = () => {
    setOpenConfirmDialog(false);
  };

  const onClickBuild = () => {
    setOpenConfirmDialog(true);
  };

  const createActiveStepNumber = (task: IFirmwareBuildingTask): number => {
    return task.status === 'waiting' ? 0 : task.status === 'building' ? 1 : 2;
  };

  const isTaskCompleted = (task: IFirmwareBuildingTask): boolean => {
    return task.status === 'success' || task.status === 'failure';
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

  return (
    <div className="catalog-build-container">
      <React.Fragment>
        <Paper sx={{ p: '16px', mb: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="text" sx={{ mr: '32px' }} onClick={onClickReload}>
              Reload
            </Button>
            <Button
              variant="contained"
              onClick={onClickBuild}
              disabled={
                props.buildableFirmware == null ||
                !props.buildableFirmware.enabled
              }
            >
              Build Firmware
            </Button>
          </Box>
        </Paper>
        <Box sx={{ mb: '32px' }}>
          {props.firmwareBuildingTasks!.map((task) => (
            <React.Fragment key={`firmware-building-task-${task.id}`}>
              <Card sx={{ mb: isTaskCompleted(task) ? '0' : '32px' }}>
                <CardContent>
                  <Box
                    sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}
                  >
                    <Typography variant="subtitle1">
                      Task ID: {task.id}
                    </Typography>
                    <Typography variant="subtitle1">
                      Updated at:{' '}
                      {moment(task.updatedAt).format('YYYY-MM-DD hh:mm:ss')}
                    </Typography>
                    <Typography variant="subtitle1">
                      Created at:{' '}
                      {moment(task.createdAt).format('YYYY-MM-DD hh:mm:ss')}
                    </Typography>
                  </Box>
                  <Stepper
                    nonLinear
                    activeStep={createActiveStepNumber(task)}
                    sx={{ m: '16px 128px 0 128px' }}
                  >
                    <Step
                      key={`firmware-building-task-${task.id}-waiting`}
                      completed={task.status !== 'waiting'}
                    >
                      <StepLabel>Waiting</StepLabel>
                    </Step>
                    <Step
                      key={`firmware-building-task-${task.id}-building`}
                      completed={isTaskCompleted(task)}
                    >
                      <StepLabel>Building</StepLabel>
                    </Step>
                    {task.status === 'success' ? (
                      <Step
                        key={`firmware-building-task-${task.id}-success`}
                        completed={true}
                      >
                        <StepLabel>Success</StepLabel>
                      </Step>
                    ) : task.status === 'failure' ? (
                      <Step key={`firmware-building-task-${task.id}-failure`}>
                        <StepLabel error={true}>Failure</StepLabel>
                      </Step>
                    ) : (
                      <Step key={`firmware-building-task-${task.id}-completed`}>
                        <StepLabel>Completed</StepLabel>
                      </Step>
                    )}
                  </Stepper>
                </CardContent>
                <CardActions
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  {task.status === 'success' && (
                    <Button
                      variant="text"
                      onClick={() => {
                        onClickDownload(task);
                      }}
                    >
                      Download
                    </Button>
                  )}
                  {task.status === 'success' && (
                    <Button
                      variant="text"
                      onClick={() => {
                        onClickFlash(task);
                      }}
                    >
                      Flash
                    </Button>
                  )}
                </CardActions>
              </Card>
              {isTaskCompleted(task) && (
                <Accordion sx={{ mb: '32px', mt: '8px' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      Logs - {task.id}
                    </Typography>
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
                        <Typography variant="subtitle2">
                          Standard Output
                        </Typography>
                        <TextField
                          multiline
                          rows={5}
                          value={task.stdout}
                          sx={{ mt: '8px' }}
                          fullWidth
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2">
                          Standard Error
                        </Typography>
                        <TextField
                          multiline
                          rows={5}
                          value={task.stderr}
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
          ))}
        </Box>
        <ConfirmDialog
          open={openConfirmDialog}
          title="Building Firmware"
          message="Are you sure to build a new firmware for this keyboard?"
          onClickYes={onClickConfirmDialogYes}
          onClickNo={onClickConfirmDialogNo}
        />
      </React.Fragment>
    </div>
  );
}
