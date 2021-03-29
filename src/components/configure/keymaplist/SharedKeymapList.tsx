import {
  AbstractKeymapData,
  SavedKeymapData,
} from '../../../services/storage/Storage';
import React from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import './SharedKeymapList.scss';

type ISharedKeymapListProps = {
  sharedKeymaps: AbstractKeymapData[];
  // eslint-disable-next-line no-unused-vars
  onClickApplySavedKeymapData: (savedKeymapData: AbstractKeymapData) => void;
  showMore: boolean;
  onClickMore?: () => void;
  limit?: number;
};

export function SharedKeymapList(props: ISharedKeymapListProps) {
  const sharedKeymaps = props.limit
    ? props.sharedKeymaps.slice(0, props.limit)
    : props.sharedKeymaps;
  return (
    <React.Fragment>
      <List dense={true}>
        {sharedKeymaps.map((item: AbstractKeymapData, index) => {
          return (
            <ListItem
              key={`shared-keymap-item-${item.id}`}
              button
              onClick={() => {
                props.onClickApplySavedKeymapData(item);
              }}
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
        })}
      </List>
      {props.sharedKeymaps!.length === 0 && (
        <div className="shared-keymap-list-no-saved-keymap">
          There is no keymap.
        </div>
      )}
      {props.showMore ? (
        <Button onClick={() => props.onClickMore!()}>more...</Button>
      ) : null}
    </React.Fragment>
  );
}
