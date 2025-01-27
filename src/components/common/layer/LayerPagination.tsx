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
import React, { useEffect, useRef } from 'react';

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

const LAYER_PAGINATION_WHEEL_TIMEOUT = 500;

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

  const pageRefs: Map<number, React.RefObject<HTMLDivElement>> = new Map();
  for (const item of items) {
    if (item.type === 'page' && item.page !== null) {
      pageRefs.set(item.page, useRef<HTMLDivElement>(null));
    }
  }

  useEffect(() => {
    let processing = false;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (processing) {
        return;
      }
      processing = true;
      if (event.deltaY < 0) {
        props.onClickPage(Math.min(props.page! + 1, props.count));
      } else if (event.deltaY > 0) {
        props.onClickPage(Math.max(1, props.page! - 1));
      }
      setTimeout(() => {
        processing = false;
      }, LAYER_PAGINATION_WHEEL_TIMEOUT);
    };
    for (const ref of pageRefs.values()) {
      ref.current?.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      for (const ref of pageRefs.values()) {
        ref.current?.removeEventListener('wheel', handleWheel);
      }
    };
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
                  onClick={(): void => {
                    props.onClickPage(page);
                  }}
                  className={selected ? '' : classes.unselected}
                  ref={pageRefs.get(page)!}
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
