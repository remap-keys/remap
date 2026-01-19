import React, { useEffect, useState } from 'react';
import catalog from '../../assets/images/top/catalog.png';
import keyAssign from '../../assets/images/top/key-assign.png';
import lighting from '../../assets/images/top/lighting.png';
import keyLayout from '../../assets/images/top/key-layout.png';
import predefinedKeys from '../../assets/images/top/predefined-keys.png';
import diff from '../../assets/images/top/diff.png';
import keymap from '../../assets/images/top/keymap.png';
import shareKeymap from '../../assets/images/top/share-keymap.png';
import textMatrix from '../../assets/images/top/text-matrix.png';
import macro from '../../assets/images/top/macro.png';
import firmwareWriting from '../../assets/images/top/firmware-writing.png';
import buildFirmware from '../../assets/images/top/build-firmware.png';
import Footer from '../common/footer/Footer.container';
import { Logo } from '../common/logo/Logo';
import './Top.scss';
import { TopActionsType, TopStateType } from './Top.container';
import { useNavigate } from 'react-router';
import {
  Alert,
  AppBar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardAltIcon from '@mui/icons-material/KeyboardAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BoltIcon from '@mui/icons-material/Bolt';
import ConstructionIcon from '@mui/icons-material/Construction';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CatalogKeywordSearchDialog from '../catalog/search/CatalogKeywordSearchDialog.container';
import { IKeyboardDefinitionDocument } from '../../services/storage/Storage';

type IFeatureCardProps = {
  image: any;
  imageTitle: string;
  title: string;
  description: string;
};

const FeatureCard = (props: IFeatureCardProps) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className="card">
        <div
          className="feature-image"
          style={{
            backgroundImage: `url(${props.image})`,
          }}
          title={props.imageTitle}
        />
        <CardContent className="card-content">
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography>{props.description}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

type OwnProps = {};
type TopPropsType = OwnProps & Partial<TopActionsType> & Partial<TopStateType>;

export default function Top(props: TopPropsType) {
  const [openCatalogKeywordSearchDialog, setOpenCatalogKeywordSearchDialog] =
    useState<boolean>(false);

  useEffect(() => {
    props.initializeMeta!();
  });

  const navigate = useNavigate();

  const onClickStartRemap = () => {
    navigate('/configure');
  };

  const onClickManageKeyboardDefinitions = () => {
    navigate('/keyboards');
  };

  const onClickKeyboardCatalog = () => {
    navigate('/catalog');
  };

  const onClickManageOrganizations = () => {
    navigate('/organizations');
  };

  const onClickFlashFirmware = () => {
    setOpenCatalogKeywordSearchDialog(true);
  };

  const onClickTypingPractice = () => {
    props.updateAutoTypingPracticeAfterConnection!(true);
    navigate('/configure');
  };

  const onClickStartWorkbench = () => {
    navigate('/workbench');
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Logo width={128} color={'white'} />
        </Toolbar>
      </AppBar>
      <Alert severity="info">
        <strong>Info: </strong>
        [Jan 19th, 2026] Master your custom keymap with the new &quot;Typing
        Practice&quot; feature!. See{' '}
        <Link href="/docs/typing-practice" target="_blank">
          for more details
        </Link>{' '}
        .
      </Alert>
      <main>
        <div className="hero-content">
          <Container maxWidth="xl">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              <Logo width={256} color={'black'} />
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              {t(
                'Remap allows you to find, build, set up and customize your keyboard quickly and easily in Web Browser.'
              )}
            </Typography>
            <div className="hero-buttons">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '900px',
                  gap: '16px',
                }}
              >
                <Card>
                  <CardActionArea onClick={onClickKeyboardCatalog}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <SearchIcon sx={{ mr: 1 }} />
                        {t('Find a Keyboard')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(
                          'Find a favorite keyboard supporting Remap by flexible conditions.'
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea onClick={onClickFlashFirmware}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <BoltIcon sx={{ mr: 1 }} />
                        {t('Flash a Firmware')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(
                          "Let's flash the firmware to the microcontroller of your assembled keyboard."
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea onClick={onClickStartRemap}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <KeyboardAltIcon sx={{ mr: 1 }} />
                        {t('Customize Your Keyboard')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(
                          "Let's customize your keyboard to make it more user-friendly by updating keymaps, changing LED lighting patterns, and more."
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea onClick={onClickTypingPractice}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <SportsEsportsIcon sx={{ mr: 1 }} />
                        {t('Typing Practice')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(
                          'Make your customized keymap truly yours through typing practice.'
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea onClick={onClickStartWorkbench}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <ConstructionIcon sx={{ mr: 1 }} />
                        {t('Firmware Workbench')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(
                          'Get your own firmware by writing it from source code.'
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea onClick={onClickManageKeyboardDefinitions}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <SettingsIcon sx={{ mr: 1 }} />
                        {t('Register/Manage Keyboards')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(
                          'This is a management feature for registered keyboard users.'
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea onClick={onClickManageOrganizations}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <CorporateFareIcon sx={{ mr: 1 }} />
                        {t('Manage Organizations')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(
                          'This is a management feature for registered organizations such as keyboard shops.'
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            </div>
          </Container>
        </div>
        <Container className="card-grid" maxWidth="md">
          <Grid container spacing={4}>
            <FeatureCard
              key={1}
              image={catalog}
              imageTitle="Keyboard Catalog"
              title={t('Keyboard Catalog')}
              description={t(
                'Find a favorite keyboard supporting Remap by flexible conditions.'
              )}
            />
            <FeatureCard
              key={2}
              image={buildFirmware}
              imageTitle="Build Firmware"
              title={t('Build a Firmware')}
              description={t('Build a firmware with your taste quickly.')}
            />
            <FeatureCard
              key={3}
              image={firmwareWriting}
              imageTitle="Flash a Firmware"
              title={t('Flash Firmware')}
              description={t(
                'Flash a firmware to microcomputer unit directly.'
              )}
            />
            <FeatureCard
              key={4}
              image={textMatrix}
              imageTitle="Test Matrix"
              title={t('Test Matrix')}
              description={t(
                'Allows you to test if your changes work after building the keyboard.'
              )}
            />
            <FeatureCard
              key={5}
              image={keyAssign}
              imageTitle="Easy key Assign"
              title={t('Easy key assign')}
              description={t(
                'Easily assign complex keycodes including Hold,Tap, and more.'
              )}
            />
            <FeatureCard
              key={6}
              image={keymap}
              imageTitle="Save/Restore Keymaps"
              title={t('Save/Restore Keymaps')}
              description={t(
                'Apply one of your saved key mappings, on demand, anytime and easily.'
              )}
            />
            <FeatureCard
              key={7}
              image={shareKeymap}
              imageTitle="Share Keymaps"
              title={t('Share Keymaps')}
              description={t('Find or share a keymap with the community.')}
            />
            <FeatureCard
              key={8}
              image={lighting}
              imageTitle="Lighting Control"
              title={t('Lighting Control')}
              description={t(
                'Simple UI for controlling Backlight and Underglow LED lighting.'
              )}
            />
            <FeatureCard
              key={9}
              image={macro}
              imageTitle="Macro"
              title={t('Macro Editor')}
              description={t(
                'Macro Editor provides a way to define multiple keystrokes easily'
              )}
            />
            <FeatureCard
              key={10}
              image={keyLayout}
              imageTitle="Key Layout"
              title={t('Key Layout')}
              description={t(
                'Intuitive customization according to the physical key layout.'
              )}
            />
            <FeatureCard
              key={11}
              image={predefinedKeys}
              imageTitle="Pre-defined Keys"
              title={t('Pre-defined Keys')}
              description={t(
                'Many Pre-defined keycodes to remap your keyboard easily.'
              )}
            />
            <FeatureCard
              key={12}
              image={diff}
              imageTitle="Compare Changes"
              title={t('Compare Changes')}
              description={t(
                'Easy-to-understand ui to highlight changes made to the keymap.'
              )}
            />
          </Grid>
        </Container>
      </main>
      <Footer />
      <CatalogKeywordSearchDialog
        open={openCatalogKeywordSearchDialog}
        onClose={() => {
          setOpenCatalogKeywordSearchDialog(false);
        }}
        onSubmit={(keyboardDefinition: IKeyboardDefinitionDocument) => {
          setOpenCatalogKeywordSearchDialog(false);
          navigate(`/catalog/${keyboardDefinition.id}/firmware`);
        }}
      />
    </React.Fragment>
  );
}
