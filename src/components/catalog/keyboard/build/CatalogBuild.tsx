import React, { useEffect, useRef, useState } from 'react';
import './CatalogBuild.scss';
import {
  CatalogBuildActionsType,
  CatalogBuildStateType,
} from './CatalogBuild.container';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
} from '@mui/material';
import {
  IBuildableFirmwareFile,
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
import { FirmwareBuildingTaskCard } from './FirmwareBuildingTaskCard';
import { t } from 'i18next';

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
    sendEventToGoogleAnalytics('catalog/build_download_firmware', {
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
    sendEventToGoogleAnalytics('catalog/build_flash_firmware', {
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
    sendEventToGoogleAnalytics('catalog/build_delete_firmware', {
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
    sendEventToGoogleAnalytics('catalog/build_build_firmware', {
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
      sendEventToGoogleAnalytics('catalog/build_change_description', {
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
          {props.buildableFirmware == null ||
          !props.buildableFirmware.enabled ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t(
                'The firmware building feature can&quot;t be used because firmware files for this keyboard are not registered by the owner yet.'
              )}
            </Alert>
          ) : null}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              control={
                <Switch checked={autoReload} onChange={onChangeAutoReload} />
              }
              label={t('Auto')}
            />
            <Button
              variant="outlined"
              sx={{ mr: '32px' }}
              onClick={onClickReload}
              disabled={!props.signedIn}
            >
              {t('Reload')}
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
              {t('Build Firmware')}
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
