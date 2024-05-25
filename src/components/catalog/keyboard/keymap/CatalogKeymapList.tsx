import React from 'react';
import './CatalogKeymapList.scss';
import { AbstractKeymapData } from '../../../../services/storage/Storage';
import {
  CatalogKeymapListActionsType,
  CatalogKeymapListStateType,
} from './CatalogKeymapList.container';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

type OwnProps = {
  // eslint-disable-next-line no-unused-vars
  onClickApplySharedKeymapData: (savedKeymapData: AbstractKeymapData) => void;
};

type CatalogKeymapListProps = OwnProps &
  Partial<CatalogKeymapListActionsType> &
  Partial<CatalogKeymapListStateType>;

type OwnState = {};

export default class CatalogKeymapList extends React.Component<
  CatalogKeymapListProps,
  OwnState
> {
  constructor(
    props: CatalogKeymapListProps | Readonly<CatalogKeymapListProps>,
  ) {
    super(props);
  }

  render() {
    const isSelected = (item: AbstractKeymapData): boolean => {
      return (
        !!this.props.selectedKeymapData &&
        this.props.selectedKeymapData.id === item.id
      );
    };
    if (this.props.sharedKeymaps && this.props.sharedKeymaps.length > 0) {
      return (
        <div className="catalog-keymap-list-wrapper">
          <div className="catalog-keymap-list-container">
            <List dense={true}>
              {this.props.sharedKeymaps!.map(
                (item: AbstractKeymapData, index) => {
                  return (
                    <ListItem
                      key={`catalog-keymap-list-keymap-${index}`}
                      button
                      onClick={() => {
                        this.props.onClickApplySharedKeymapData!(item);
                      }}
                      selected={isSelected(item)}
                    >
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body1"
                              color="textPrimary"
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textSecondary"
                            >
                              {` by ${item.author_display_name}`}
                            </Typography>
                          </React.Fragment>
                        }
                        secondary={item.desc}
                      />
                    </ListItem>
                  );
                },
              )}
            </List>
          </div>
        </div>
      );
    } else {
      return <div>There is no shared keymap.</div>;
    }
  }
}
