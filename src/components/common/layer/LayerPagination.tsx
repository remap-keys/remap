import { Badge, Chip, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import usePagination from '@mui/material/usePagination';
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  MoreHoriz,
  MoreVert,
} from '@mui/icons-material';

const UlVertical = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const UlHorizontal = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const Li = styled('li')({
  display: 'flex',
});

type LayerPaginationOrientation = 'horizontal' | 'vertical';

type LayerPaginationProps = {
  count: number;
  invisiblePages: boolean[];
  page: number;
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

  const { items } = usePagination({
    count: props.count,
    page: props.page,
    onChange: (event, page) => {
      props.onClickPage(page);
    },
  });

  const Ul = props.orientation === 'vertical' ? UlVertical : UlHorizontal;

  return (
    <nav>
      <Ul>
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
                  label={page - 1}
                  color={selected ? 'primary' : undefined}
                  clickable={!selected}
                  onClick={() => {
                    props.onClickPage(page);
                  }}
                  sx={{ border: selected ? 'none' : '0 !important' }}
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
          return <Li key={index}>{children}</Li>;
        })}
      </Ul>
    </nav>
  );
}
