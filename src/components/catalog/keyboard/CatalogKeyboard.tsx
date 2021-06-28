import './CatalogKeyboard.scss';
import React from 'react';
import {
  CatalogKeyboardActionsType,
  CatalogKeyboardStateType,
} from './CatalogKeyboard.container';
import { Grid, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { getGitHubUserName } from '../../../services/storage/Storage';

type CatalogKeyboardState = {};
type OwnProps = {};
type CatalogKeyboardProps = OwnProps &
  Partial<CatalogKeyboardActionsType> &
  Partial<CatalogKeyboardStateType>;

class CatalogKeyboard extends React.Component<
  CatalogKeyboardProps,
  CatalogKeyboardState
> {
  constructor(props: CatalogKeyboardProps | Readonly<CatalogKeyboardProps>) {
    super(props);
  }

  render() {
    return (
      <div className="catalog-keyboard-wrapper">
        <div className="catalog-keyboard-container">
          <Tabs
            variant="fullWidth"
            centered
            value={0}
            indicatorColor="primary"
            className="catalog-keyboard-tabs"
          >
            <Tab label="Introduction" />
            <Tab label="Keymap" />
          </Tabs>
          <Paper elevation={0} className="catalog-keyboard-content">
            <Grid container>
              <Grid item sm={6} className="catalog-keyboard-column">
                <div className="catalog-keyboard-image">
                  <img src={this.props.definitionDocument!.imageUrl} />
                </div>
              </Grid>
              <Grid item sm={6} className="catalog-keyboard-column">
                <Paper variant="outlined">
                  <div className="catalog-keyboard-header">
                    <Typography variant="h5">
                      {this.props.definitionDocument!.name}
                    </Typography>
                    <Typography variant="subtitle1">
                      designed by{' '}
                      {getGitHubUserName(this.props.definitionDocument!)}
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
    );
  }
}

export default CatalogKeyboard;
