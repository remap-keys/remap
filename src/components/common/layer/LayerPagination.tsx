import { Badge, Chip, IconButton } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import usePagination from '@mui/material/usePagination';
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  MoreHoriz,
  MoreVert,
} from '@mui/icons-material';
import React from 'react';

const useLayerPaginationStyles = makeStyles({
  ulVertical: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ulHorizontal: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  li: {
    display: 'flex',
  },
  unselected: {
    border: '0 !important',
  },
});

type LayerPaginationOrientation = 'horizontal' | 'vertical';

type LayerPaginationProps = {
  count: number;
  invisiblePages: boolean[];
  page: number | null;
  // eslint-disable-next-line no-unused-vars
  onClickPage: (page: number) => void;
  orientation: LayerPaginationOrientation;
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
    page: props.page !== null ? props.page : 1,
    onChange: (event, page) => {
      props.onClickPage(page);
    },
  });
  return (
    <nav>
      <ul
        className={
          props.orientation === 'vertical'
            ? classes.ulVertical
            : classes.ulHorizontal
        }
      >
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;
          if (type === 'page' && page !== null) {
            children = (
              <StyledBadge
                color="primary"
                variant="dot"
                invisible={props.invisiblePages[page - 1]}
              >
                <Chip
                  variant="outlined"
                  size="medium"
                  label={page - 1}
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
                {props.orientation === 'vertical' ? (
                  <KeyboardArrowDown />
                ) : (
                  <KeyboardArrowRight />
                )}
              </IconButton>
            );
          } else if (type === 'previous') {
            children = (
              <IconButton
                size="small"
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {props.orientation === 'vertical' ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowLeft />
                )}
              </IconButton>
            );
          } else if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children =
              props.orientation === 'vertical' ? <MoreVert /> : <MoreHoriz />;
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
