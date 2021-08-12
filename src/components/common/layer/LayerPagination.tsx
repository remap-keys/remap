import {
  Badge,
  Chip,
  IconButton,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import { usePagination } from '@material-ui/lab';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVert,
} from '@material-ui/icons';
import React from 'react';

const useLayerPaginationStyles = makeStyles({
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  li: {
    display: 'flex',
  },
  unselected: {
    border: 0,
  },
});

type LayerPaginationProps = {
  count: number;
  invisiblePages: boolean[];
  page: number;
  // eslint-disable-next-line no-unused-vars
  onClickPage: (page: number) => void;
};

export default function LayerPagination(props: LayerPaginationProps) {
  const StyledBadge = withStyles(() => ({
    badge: {
      right: 11,
      top: 9,
      border: `2px solid white`,
    },
  }))(Badge);

  const classes = useLayerPaginationStyles();
  const { items } = usePagination({
    count: props.count,
    page: props.page,
    onChange: (event, page) => {
      props.onClickPage(page);
    },
  });
  return (
    <nav>
      <ul className={classes.ul}>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;
          if (type === 'page') {
            children = (
              <StyledBadge
                color="primary"
                variant="dot"
                invisible={props.invisiblePages[page - 1]}
              >
                <Chip
                  variant="outlined"
                  size="medium"
                  label={page}
                  color={selected ? 'primary' : undefined}
                  clickable={!selected}
                  onClick={() => {
                    props.onClickPage(page);
                  }}
                  className={selected ? '' : classes.unselected}
                />
              </StyledBadge>
            );
          } else if (type === 'next') {
            children = (
              <IconButton
                size="small"
                onClick={item.onClick}
                disabled={item.disabled}
              >
                <KeyboardArrowDown />
              </IconButton>
            );
          } else if (type === 'previous') {
            children = (
              <IconButton
                size="small"
                onClick={item.onClick}
                disabled={item.disabled}
              >
                <KeyboardArrowUp />
              </IconButton>
            );
          } else if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = <MoreVert />;
          }
          return (
            <li key={index} className={classes.li}>
              {children}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
