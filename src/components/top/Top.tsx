import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Link,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import card1 from '../../assets/images/top/card-1.png';
import card2 from '../../assets/images/top/card-2.png';
import card3 from '../../assets/images/top/card-3.png';
import card4 from '../../assets/images/top/card-4.png';
import card5 from '../../assets/images/top/card-5.png';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Top = () => {
  const classes = useStyles();
  const history = useHistory();

  const onClickStartRemap = () => {
    history.push('/configure');
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Remap
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Remap
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
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickStartRemap}
                  >
                    Start Remap for your keyboard!
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" disabled={true}>
                    For Keyboard Developers
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Grid item key={1} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card1}
                  title="card-1"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Direct Access
                  </Typography>
                  <Typography>
                    Remap allows you to customize your keyboard from Web Browser
                    directly without installing app.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item key={2} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card2}
                  title="card-2"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Key Layout
                  </Typography>
                  <Typography>
                    Intuitive customization according to the actual key layout.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item key={3} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card3}
                  title="card-3"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Show Difference
                  </Typography>
                  <Typography>
                    Easy-to-understand display of keymap changes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item key={4} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card5}
                  title="card-5"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Pre-defined Keys
                  </Typography>
                  <Typography>
                    Provide many Pre-defined keys to enable remap your key
                    mapping easily.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item key={5} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card4}
                  title="card-4"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Define Own Key
                  </Typography>
                  <Typography>
                    Direct definition of keycode for complex keybindings with a
                    free label.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Remap
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Allow to customize your keyboard more easily.
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="http://twitter.com/yoichiro">
            @yoichiro
          </Link>
          ,{' '}
          <Link color="inherit" href="http://twitter.com/adamrocker">
            @adamrocker
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
          {'All rights reserved.'}
        </Typography>
      </footer>
    </React.Fragment>
  );
};

export default Top;
