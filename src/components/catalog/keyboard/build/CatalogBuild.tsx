import React from 'react';
import './CatalogBuild.scss';
import {
  CatalogBuildActionsType,
  CatalogBuildStateType,
} from './CatalogBuild.container';
import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
} from '@mui/material';
import ConfirmDialog from '../../../common/confirm/ConfirmDialog';
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

  return (
    <div className="catalog-build-container">
      <React.Fragment>
        <Paper sx={{ p: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={onClickBuild}>
              Build
            </Button>
          </Box>
        </Paper>
        {props.firmwareBuildingTasks!.map((task) => (
          <Card key={`firmware-building-task-${task.id}`}>
            <CardContent>
              <Typography variant="subtitle1">Task ID: {task.id}</Typography>
            </CardContent>
          </Card>
        ))}
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
