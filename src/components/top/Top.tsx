import {
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
} from '@material-ui/core';
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
import Footer from '../common/footer/Footer.container';
import { Logo } from '../common/logo/Logo';
import './Top.scss';
import { Alert } from '@material-ui/lab';
import { TopActionsType, TopStateType } from './Top.container';
import { useNavigate } from 'react-router-dom';

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
        <strong>For all users: </strong>The{' '}
        <Link
          href="https://remap-keys.app/docs/terms_of_use"
          target="_blank"
          rel="noreferrer"
        >
          Remap Terms of Use
        </Link>{' '}
        and{' '}
        <Link
          href="https://remap-keys.app/docs/review_policy"
          target="_blank"
          rel="noreferrer"
        >
          Remap Review Policy
        </Link>{' '}
        has been updated on January 5th, 2022.
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
              Remap allows you to configure keymaps and lightings of your
              keyboard with QMK firmware in Web Browser.
            </Typography>
            <div className="hero-buttons">
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickStartRemap}
                  >
                    Start Remap for Your Keyboard
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={onClickKeyboardCatalog}
                  >
                    Keyboard Catalog
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} justify="center">
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
              image={firmwareWriting}
              imageTitle="Write Firmware"
              title="Write Firmware"
              description="Write a firmware to microcomputer unit directly."
            />
            <FeatureCard
              key={3}
              image={textMatrix}
              imageTitle="Test Matrix"
              title="Test Matrix"
              description="Allows you to test if your changes work after building the keyboard."
            />
            <FeatureCard
              key={4}
              image={keyAssign}
              imageTitle="Easy key Assign"
              title="Easy key assign"
              description="Easily assign complex keycodes including Hold,Tap, and more."
            />
            <FeatureCard
              key={5}
              image={keymap}
              imageTitle="Save/Restore Keymaps"
              title="Save/Restore Keymaps"
              description="Apply one of your saved key mappings, on demand, anytime and easily."
            />
            <FeatureCard
              key={6}
              image={shareKeymap}
              imageTitle="Share Keymaps"
              title="Share Keymaps"
              description="Find or share a keymap with the community."
            />
            <FeatureCard
              key={7}
              image={lighting}
              imageTitle="Lighting Control"
              title="Lighting Control"
              description="Simple UI for controlling Backlight and Underglow LED lighting."
            />
            <FeatureCard
              key={8}
              image={macro}
              imageTitle="Macro"
              title="Macro Editor"
              description="Macro Editor provides a way to define multiple keystrokes easily"
            />
            <FeatureCard
              key={9}
              image={keyLayout}
              imageTitle="Key Layout"
              title="Key Layout"
              description="Intuitive customization according to the physical key layout."
            />
            <FeatureCard
              key={10}
              image={predefinedKeys}
              imageTitle="Pre-defined Keys"
              title="Pre-defined Keys"
              description="Many Pre-defined keycodes to remap your keyboard easily."
            />
            <FeatureCard
              key={11}
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
