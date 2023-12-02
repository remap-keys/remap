import React, { useEffect } from 'react';
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
import xmasLogo from '../../assets/images/top/xmas-logo.svg';
import Footer from '../common/footer/Footer.container';
import { Logo } from '../common/logo/Logo';
import './Top.scss';
import { TopActionsType, TopStateType } from './Top.container';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AppBar,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';

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
        [Nov 30th 2023] Remap supports a code editing for building a firmware.
        See{' '}
        <Link
          href="/docs/support-code-editing"
          target="_blank"
          rel="noreferrer"
        >
          more detail
        </Link>
        .
      </Alert>
      <Alert severity="info">
        <strong>Info: </strong>
        [Nov 11th 2023] The firmware building feature has been released. See{' '}
        <Link href="/docs/build" target="_blank" rel="noreferrer">
          more detail
        </Link>
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
              <img src={xmasLogo} height={64} alt="Remap Xmas Logo" />
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Remap allows you to find, build, set up and customize your
              keyboard quickly and easily in Web Browser.
            </Typography>
            <div className="hero-buttons">
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickStartRemap}
                  >
                    Customize Your Keyboard
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={onClickKeyboardCatalog}
                  >
                    Find a Keyboard
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={onClickManageKeyboardDefinitions}
                  >
                    Register/Manage Keyboards
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={onClickManageOrganizations}
                  >
                    Manage Organizations
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className="card-grid" maxWidth="md">
          <Grid container spacing={4}>
            <FeatureCard
              key={1}
              image={catalog}
              imageTitle="Keyboard Catalog"
              title="Keyboard Catalog"
              description="Find a favorite keyboard supporting Remap by flexible conditions."
            />
            <FeatureCard
              key={2}
              image={buildFirmware}
              imageTitle="Build Firmware"
              title="Build a Firmware"
              description="Build a firmware with your taste quickly."
            />
            <FeatureCard
              key={3}
              image={firmwareWriting}
              imageTitle="Flash a Firmware"
              title="Flash Firmware"
              description="Flash a firmware to microcomputer unit directly."
            />
            <FeatureCard
              key={4}
              image={textMatrix}
              imageTitle="Test Matrix"
              title="Test Matrix"
              description="Allows you to test if your changes work after building the keyboard."
            />
            <FeatureCard
              key={5}
              image={keyAssign}
              imageTitle="Easy key Assign"
              title="Easy key assign"
              description="Easily assign complex keycodes including Hold,Tap, and more."
            />
            <FeatureCard
              key={6}
              image={keymap}
              imageTitle="Save/Restore Keymaps"
              title="Save/Restore Keymaps"
              description="Apply one of your saved key mappings, on demand, anytime and easily."
            />
            <FeatureCard
              key={7}
              image={shareKeymap}
              imageTitle="Share Keymaps"
              title="Share Keymaps"
              description="Find or share a keymap with the community."
            />
            <FeatureCard
              key={8}
              image={lighting}
              imageTitle="Lighting Control"
              title="Lighting Control"
              description="Simple UI for controlling Backlight and Underglow LED lighting."
            />
            <FeatureCard
              key={9}
              image={macro}
              imageTitle="Macro"
              title="Macro Editor"
              description="Macro Editor provides a way to define multiple keystrokes easily"
            />
            <FeatureCard
              key={10}
              image={keyLayout}
              imageTitle="Key Layout"
              title="Key Layout"
              description="Intuitive customization according to the physical key layout."
            />
            <FeatureCard
              key={11}
              image={predefinedKeys}
              imageTitle="Pre-defined Keys"
              title="Pre-defined Keys"
              description="Many Pre-defined keycodes to remap your keyboard easily."
            />
            <FeatureCard
              key={12}
              image={diff}
              imageTitle="Compare Changes"
              title="Compare Changes"
              description="Easy-to-understand ui to highlight changes made to the keymap."
            />
          </Grid>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}
