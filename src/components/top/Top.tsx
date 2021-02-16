import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import card1 from '../../assets/images/top/card-1.png';
import card2 from '../../assets/images/top/card-2.png';
import card3 from '../../assets/images/top/card-3.png';
import card4 from '../../assets/images/top/card-4.png';
import card5 from '../../assets/images/top/card-5.png';
import Footer from '../common/footer/Footer.container';
import { Logo } from '../common/logo/Logo';
import './Top.scss';

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
        <CardMedia
          className="card-media"
          image={props.image}
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

class Top extends React.Component<RouteComponentProps, any> {
  onClickStartRemap = () => {
    this.props.history.push('/configure');
  };

  onClickManageKeyboardDefinitions = () => {
    this.props.history.push('/keyboards');
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
                Remap allows you to customize a keymap assign of your keyboard
                directly in Web Browser.
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
                      Manage Keyboard Definitions
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
                image={card1}
                imageTitle="card-1"
                title="Direct Access"
                description="Remap allows you to customize your keyboard from Web
                      Browser directly without installing app."
              />
              <FeatureCard
                key={2}
                image={card2}
                imageTitle="card-2"
                title="Key Layout"
                description="Intuitive customization according to the actual key
                      layout."
              />
              <FeatureCard
                key={3}
                image={card3}
                imageTitle="card-3"
                title="Show Difference"
                description="Easy-to-understand display of keymap changes."
              />
              <FeatureCard
                key={4}
                image={card5}
                imageTitle="card-5"
                title="Pre-defined Keys"
                description="Provide many Pre-defined keys to enable remap your key
                      mapping easily."
              />
              <FeatureCard
                key={5}
                image={card4}
                imageTitle="card-4"
                title="Easy key assign"
                description="Allow you to assign complex keymap easily including Hold/Tap and etc."
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
