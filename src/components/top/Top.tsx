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
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import browserAccess from '../../assets/images/top/browser-access.png';
import keyAssign from '../../assets/images/top/key-assign.png';
import lighting from '../../assets/images/top/lighting.png';
import keyLayout from '../../assets/images/top/key-layout.png';
import predefinedKeys from '../../assets/images/top/predefined-keys.png';
import diff from '../../assets/images/top/diff.png';
import keymap from '../../assets/images/top/keymap.png';
import shareKeymap from '../../assets/images/top/share-keymap.png';
import textMatrix from '../../assets/images/top/text-matrix.png';
import macro from '../../assets/images/top/macro.png';
import Footer from '../common/footer/Footer.container';
import { Logo } from '../common/logo/Logo';
import './Top.scss';
import { Alert } from '@material-ui/lab';
import { TopActionsType, TopStateType } from './Top.container';

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

type TopState = {};

type OwnProps = {};
type TopPropsType = OwnProps &
  Partial<TopActionsType> &
  Partial<TopStateType> &
  RouteComponentProps;

class Top extends React.Component<TopPropsType, TopState> {
  constructor(props: TopPropsType | Readonly<TopPropsType>) {
    super(props);
  }

  componentDidMount() {
    this.props.initializeMeta!();
  }

  onClickStartRemap = () => {
    this.props.history.push('/configure');
  };

  onClickManageKeyboardDefinitions = () => {
    this.props.history.push('/keyboards');
  };

  onClickKeyboardCatalog = () => {
    this.props.history.push('/catalog');
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Logo width={128} color={'white'} />
          </Toolbar>
        </AppBar>
        <Alert severity="info">
          <strong>For Keyboard Owners: </strong>The{' '}
          <Link href="/catalog">Keyboard Catalog</Link> feature has been
          released. Please fill in information for your keyboard so that it will
          be listed in the keyboard catalog. See{' '}
          <Link
            href="https://docs.google.com/document/d/1vuQTFeUgReWO9QbcCwxHVqARINp0wVH2lTaZhnNJGBU/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            this document
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
                      onClick={this.onClickStartRemap}
                    >
                      Start Remap for your keyboard
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={this.onClickManageKeyboardDefinitions}
                    >
                      Register/Manage Keyboard Definitions
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={this.onClickKeyboardCatalog}
                    >
                      Keyboard Catalog
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
                image={browserAccess}
                imageTitle="Direct Access"
                title="Direct Access"
                description="Configure your keyboard from the Web
                      Browser without installing an app."
              />
              <FeatureCard
                key={2}
                image={keyAssign}
                imageTitle="Easy key Assign"
                title="Easy key assign"
                description="Easily assign complex keycodes including Hold,Tap, and more."
              />
              <FeatureCard
                key={3}
                image={keymap}
                imageTitle="Save/Restore Keymaps"
                title="Save/Restore Keymaps"
                description="Apply one of your saved key mappings, on demand, anytime and easily."
              />
              <FeatureCard
                key={4}
                image={shareKeymap}
                imageTitle="Share Keymaps"
                title="Share Keymaps"
                description="Find or share a keymap with the community."
              />
              <FeatureCard
                key={5}
                image={lighting}
                imageTitle="Lighting Control"
                title="Lighting Control"
                description="Simple UI for controlling Backlight and Underglow LED lighting."
              />
              <FeatureCard
                key={6}
                image={macro}
                imageTitle="Macro"
                title="Macro Editor"
                description="Macro Editor provides a way to define multiple keystrokes easily"
              />
              <FeatureCard
                key={7}
                image={keyLayout}
                imageTitle="Key Layout"
                title="Key Layout"
                description="Intuitive customization according to the physical key layout."
              />
              <FeatureCard
                key={8}
                image={predefinedKeys}
                imageTitle="Pre-defined Keys"
                title="Pre-defined Keys"
                description="Many Pre-defined keycodes to remap your keyboard easily."
              />
              <FeatureCard
                key={9}
                image={diff}
                imageTitle="Compare Changes"
                title="Compare Changes"
                description="Easy-to-understand ui to highlight changes made to the keymap."
              />
              <FeatureCard
                key={10}
                image={textMatrix}
                imageTitle="Test Matrix"
                title="Test Matrix"
                description="Allows you to test if your changes work after building the keyboard."
              />
            </Grid>
          </Container>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(Top);
