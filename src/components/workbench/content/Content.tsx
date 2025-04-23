import React from 'react';
import { ContentActionsType, ContentStateType } from './Content.container';
import './Content.scss';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import Breadboard from '../breadboard/Breadboard.container';
import AuthProviderDialog from '../../common/auth/AuthProviderDialog.container';
import { t } from 'i18next';

type OwnProps = {};
type ContentProps = OwnProps &
  Partial<ContentActionsType> &
  Partial<ContentStateType>;

export default function Content(props: ContentProps | Readonly<ContentProps>) {
  if (!props.signedIn!) {
    return <NotSignedIn />;
  }
  const phase = props.phase!;
  switch (phase) {
    case 'processing':
      return <PhaseProcessing />;
    case 'editing':
      return <Breadboard />;
    default:
      throw new Error(`Unknown state.workbench.app.phase value: ${phase}`);
  }
}

function PhaseProcessing() {
  return (
    <div className="workbench-processing-wrapper">
      <div>
        <CircularProgress size={24} />
      </div>
      <div>{t('Processing')}...</div>
    </div>
  );
}

function NotSignedIn() {
  const [openAuthProviderDialog, setOpenAuthProviderDialog] =
    React.useState<boolean>(false);

  return (
    <>
      <div className="workbench-not-signed-in-wrapper">
        <Card>
          <CardContent>
            <Typography variant="h4">{t('Not logged in')}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {t('Please log in to use the Firmware Workbench.')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => setOpenAuthProviderDialog(true)}>
              {t('Login')}
            </Button>
          </CardActions>
        </Card>
      </div>
      <AuthProviderDialog
        open={openAuthProviderDialog}
        onClose={() => setOpenAuthProviderDialog(false)}
      />
    </>
  );
}
