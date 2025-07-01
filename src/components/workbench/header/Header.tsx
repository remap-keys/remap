import React, { useEffect, useState } from 'react';
import './Header.scss';
import { HeaderActionsType, HeaderStateType } from './Header.container';
import { Logo } from '../../common/logo/Logo';
import ProfileIcon from '../../common/auth/ProfileIcon.container';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BuildIcon from '@mui/icons-material/Build';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Button,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useDebounce } from '../../common/hooks/DebounceHook';
import {
  IBuildableFirmwareQmkFirmwareVersion,
  IWorkbenchProject,
} from '../../../services/storage/Storage';
import WorkbenchProjectsDialog from '../dialogs/WorkbenchProjectsDialog';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import WorkbenchProjectSettingsDialog from '../dialogs/WorkbenchProjectSettingsDialog';
import { CreateNewWorkbenchProjectDialog } from '../dialogs/CreateNewWorkbenchProjectDialog';
import { t } from 'i18next';
import RemainingBuildPurchaseDialog from '../dialogs/RemainingBuildPurchaseDialog.container';
import PaymentIcon from '@mui/icons-material/Payment';
import RemainingBuildPurchaseHistoryDialog from '../dialogs/RemainingBuildPurchaseHistoryDialog.container';

type OwnProps = {};
type HeaderProps = OwnProps &
  Partial<HeaderActionsType> &
  Partial<HeaderStateType>;

export default function Header(props: HeaderProps | Readonly<HeaderProps>) {
  const [projectName, setProjectName] = useState<string>('');
  const [openProjectsDialog, setOpenProjectsDialog] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [targetDeleteProject, setTargetDeleteProject] = useState<
    IWorkbenchProject | undefined
  >(undefined);
  const [openProjectSettingsDialog, setOpenProjectSettingsDialog] =
    useState<boolean>(false);
  const [
    openRemainingBuildPurchaseDialog,
    setOpenRemainingBuildPurchaseDialog,
  ] = useState<boolean>(false);
  const [openCreateProjectDialog, setOpenCreateProjectDialog] =
    useState<boolean>(false);

  useEffect(() => {
    if (props.currentProject === undefined) {
      return;
    }
    setProjectName(props.currentProject.name);
  }, [props.currentProject]);

  const debouncedProjectName = useDebounce(
    projectName,
    props.currentProject?.id,
    1000
  );
  useEffect(() => {
    if (props.currentProject === undefined) {
      return;
    }
    if (props.currentProject.id !== debouncedProjectName.base) {
      console.warn(
        'Project name is changed, but the project id is not the same. This should not happen.'
      );
      return;
    }
    if (debouncedProjectName.value === '') {
      return;
    }
    const currentProject = props.currentProject;
    const currentProjectName = currentProject.name;
    if (currentProjectName === debouncedProjectName.value) {
      return;
    }
    const newCurrentProject: IWorkbenchProject = {
      ...currentProject,
      name: debouncedProjectName.value,
    };
    props.updateWorkbenchProject!(newCurrentProject);
  }, [debouncedProjectName]);

  const onChangeProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.currentProject === null) {
      return;
    }
    const name = event.target.value;
    setProjectName(name);
  };

  const onClickProjects = () => {
    if (props.currentProject === undefined) {
      return;
    }
    setOpenProjectsDialog(true);
  };

  const onClickCreateNewProject = () => {
    setOpenProjectsDialog(false);
    setOpenCreateProjectDialog(true);
  };

  const onSubmitCreateNewProject = (
    projectName: string,
    qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion,
    keyboardDirectoryName: string,
    createTemplateFiles: boolean,
    keyboardInfo?: {
      keyboardName: string;
      maintainer: string;
      manufacturer: string;
      mcuType: 'development_board' | 'integrated_mcu';
      mcu: string;
    }
  ) => {
    props.createNewWorkbenchProjectWithOptions!(
      projectName,
      qmkFirmwareVersion,
      keyboardDirectoryName,
      createTemplateFiles,
      keyboardInfo
    );
    setOpenCreateProjectDialog(false);
  };

  const onClickOpenProject = (project: IWorkbenchProject) => {
    props.switchCurrentWorkbenchProject!(project);
    props.updateSelectedFile!(undefined);
    setOpenProjectsDialog(false);
  };

  const onClickDeleteProject = (project: IWorkbenchProject) => {
    setOpenProjectsDialog(false);
    setTargetDeleteProject(project);
    setOpenConfirmDialog(true);
  };

  const onClickYesDeleteProject = () => {
    if (targetDeleteProject === undefined) {
      return;
    }
    props.deleteWorkbenchProject!(targetDeleteProject);
    setOpenConfirmDialog(false);
    setTargetDeleteProject(undefined);
  };

  const onClickProjectSettings = () => {
    setOpenProjectSettingsDialog(true);
  };

  const onApplyProjectSettings = (
    qmkFirmwareVersion: IBuildableFirmwareQmkFirmwareVersion,
    keyboardDirectoryName: string
  ) => {
    if (props.currentProject === undefined) {
      return;
    }
    const currentProject = props.currentProject;
    const newCurrentProject: IWorkbenchProject = {
      ...currentProject,
      qmkFirmwareVersion,
      keyboardDirectoryName,
    };
    props.updateWorkbenchProject!(newCurrentProject);
    setOpenProjectSettingsDialog(false);
  };

  const onClickBuild = () => {
    if (props.currentProject === undefined) {
      return;
    }
    props.createFirmwareBuildingTask!(props.currentProject);
  };

  const onClickPurchase = () => {
    setOpenRemainingBuildPurchaseDialog(true);
  };

  const onPurchaseRemainingBuilds = () => {
    setOpenRemainingBuildPurchaseDialog(false);
    props.showMessage!(t('Purchase completed successfully'));
  };

  const onClickPurchaseHistory = () => {
    props.fetchUserPurchaseHistories!();
  };

  return (
    <React.Fragment>
      <header className="workbench-header">
        <div className="workbench-header-logo">
          <a href="/">
            <Logo width={100} />
          </a>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {t('Firmware Workbench')}
          </Typography>
          <Typography variant="overline" sx={{ ml: 1 }}>
            {t('Beta version')}
          </Typography>
        </div>
        <div className="workbench-header-right">
          {props.signedIn && (
            <>
              <TextField
                size="small"
                value={projectName}
                onChange={onChangeProjectName}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={onClickProjectSettings}>
                        <TuneIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '300px' }}
              />
              <Button
                variant="text"
                size="small"
                startIcon={<AccountTreeIcon />}
                onClick={onClickProjects}
              >
                {t('Projects')}
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<BuildIcon />}
                color={
                  props.userPurchase !== undefined &&
                  props.userPurchase.remainingBuildCount > 0
                    ? 'primary'
                    : 'warning'
                }
                onClick={
                  props.userPurchase !== undefined &&
                  props.userPurchase.remainingBuildCount > 0
                    ? onClickBuild
                    : onClickPurchase
                }
              >
                {t('Build')} ({props.userPurchase?.remainingBuildCount || 0})
              </Button>
            </>
          )}
          <div className="workbench-header-menu-button">
            <ProfileIcon
              logout={() => {
                props.logout!();
              }}
              childrenWithOnClose={(onClose) => {
                if (props.signedIn) {
                  return (
                    <MenuItem
                      key="workbench-header-menu-purchase-history"
                      onClick={() => {
                        onClose();
                        onClickPurchaseHistory();
                      }}
                    >
                      <ListItemIcon>
                        <PaymentIcon />
                      </ListItemIcon>
                      <ListItemText>{t('Purchase History')}</ListItemText>
                    </MenuItem>
                  );
                } else {
                  return null;
                }
              }}
            />
          </div>
        </div>
      </header>
      <WorkbenchProjectsDialog
        open={openProjectsDialog}
        projects={props.projects}
        currentProject={props.currentProject}
        onClose={() => {
          setOpenProjectsDialog(false);
        }}
        onCreateNewProject={onClickCreateNewProject}
        onOpenProject={onClickOpenProject}
        onDeleteProject={onClickDeleteProject}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        title={t('Confirm')}
        message={t('Are you sure you want to delete the project?', {
          name: targetDeleteProject?.name,
        })}
        onClickYes={onClickYesDeleteProject}
        onClickNo={() => {
          setOpenConfirmDialog(false);
        }}
      />
      <WorkbenchProjectSettingsDialog
        open={openProjectSettingsDialog}
        onClose={() => {
          setOpenProjectSettingsDialog(false);
        }}
        workbenchProject={props.currentProject}
        onApply={onApplyProjectSettings}
      />
      <RemainingBuildPurchaseDialog
        open={openRemainingBuildPurchaseDialog}
        onClose={() => {
          setOpenRemainingBuildPurchaseDialog(false);
        }}
        onPurchase={onPurchaseRemainingBuilds}
      ></RemainingBuildPurchaseDialog>
      <RemainingBuildPurchaseHistoryDialog />
      <CreateNewWorkbenchProjectDialog
        open={openCreateProjectDialog}
        onClose={() => {
          setOpenCreateProjectDialog(false);
        }}
        onSubmit={onSubmitCreateNewProject}
        existingProjectNames={props.projects?.map((p) => p.name) || []}
      />
    </React.Fragment>
  );
}
