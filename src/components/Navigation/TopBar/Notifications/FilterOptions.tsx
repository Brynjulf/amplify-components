import { FC, MutableRefObject, useRef, useState } from 'react';

import { Icon, Menu, Typography } from '@equinor/eds-core-react';
import {
  checkbox,
  checkbox_outline,
  filter_list,
  sort,
} from '@equinor/eds-icons';
import { tokens } from '@equinor/eds-tokens';
import { useOutsideClick } from '@equinor/eds-utils';

import {
  FilterNotification,
  SortNotification,
} from './NotificationsTemplate/Notifications.types';

import styled from 'styled-components';

const { spacings, colors, shape } = tokens;

const MenuItem = styled(Menu.Item)`
  display: flex;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${spacings.comfortable.small};
  padding: ${spacings.comfortable.medium};
`;

const StyledMenu = styled(Menu)`
  padding: ${spacings.comfortable.small} 0;
`;

const Heading = styled.div`
  padding: ${spacings.comfortable.small} ${spacings.comfortable.large};
`;

interface ChipProps {
  $active: boolean;
}

const StyledChip = styled.span<ChipProps>`
  font-family: 'Equionor', sans-serif;
  font-size: 12px;
  border-radius: ${shape.rounded.borderRadius};
  border: ${({ $active }) =>
    $active
      ? `solid 1px ${colors.interactive.primary__selected_hover.hex}`
      : `solid 1px ${colors.ui.background__medium.hex}`};
  background-color: ${({ $active }) =>
    $active
      ? colors.interactive.primary__selected_highlight.hex
      : colors.ui.background__default.hex};
  color: black;
  padding: ${spacings.comfortable.x_small} ${spacings.comfortable.small};
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: ${spacings.comfortable.small};
  cursor: pointer;
  &:hover {
    background: ${colors.interactive.primary__selected_highlight.hex};
  }

  > p {
    line-height: normal;
    height: min-content;
    font-size: 12px;
  }
  > svg {
    color: ${({ $active }) =>
      $active
        ? colors.text.static_icons__default.hex
        : colors.interactive.primary__resting.hex};
  }
`;

interface FilterOptionsProps {
  onFilter: (value: FilterNotification[]) => void;
  onSort: (value: SortNotification[]) => void;
  sortMenuRef: MutableRefObject<HTMLDivElement | null>;
  filterMenuRef: MutableRefObject<HTMLDivElement | null>;
}

const FilterOptions: FC<FilterOptionsProps> = ({
  onFilter,
  onSort,
  sortMenuRef,
  filterMenuRef,
}) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const filterRef = useRef<HTMLButtonElement | null>(null);
  const sortRef = useRef<HTMLButtonElement | null>(null);

  const [selectedSort, setSelectedSort] = useState({
    [SortNotification.UNREAD]: false,
    [SortNotification.OLD_NEWEST]: false,
    [SortNotification.NEW_OLDEST]: false,
  });

  const [selectedFilter, setSelectedFilter] = useState({
    [FilterNotification.SYSTEM]: false,
    [FilterNotification.USER]: false,
    [FilterNotification.UNREAD]: false,
  });

  const onClickOpenFilter = () => {
    setOpenFilter(true);
    setOpenSort(false);
  };
  const onClickCloseFilter = () => {
    setOpenFilter(false);
  };

  const onClickOpenSort = () => {
    setOpenSort(true);
    setOpenFilter(false);
  };

  const onClickCloseSort = () => {
    setOpenSort(false);
  };

  const handleFilter = (value: FilterNotification) => {
    onFilter(selectedFilter[value] ? [] : [value]);
    setSelectedFilter((prevState) => ({
      ...prevState,
      [value]: !prevState[value],
    }));
  };

  const handleSorting = (value: SortNotification) => {
    onSort(selectedSort[value] ? [] : [value]);
    setSelectedSort((prevState) => ({
      ...prevState,
      [value]: !prevState[value],
    }));
  };

  useOutsideClick(filterMenuRef.current, (event) => {
    if (
      openFilter &&
      filterRef.current !== null &&
      !filterRef.current?.contains(event.target as Node)
    ) {
      onClickCloseFilter();
    }
  });

  useOutsideClick(sortMenuRef.current, (event) => {
    if (
      openSort &&
      sortRef.current !== null &&
      !sortRef.current?.contains(event.target as Node)
    ) {
      onClickCloseSort();
    }
  });

  return (
    <>
      <FilterContainer>
        <StyledChip
          onClick={() =>
            openFilter ? onClickCloseFilter() : onClickOpenFilter()
          }
          ref={filterRef}
          $active={openFilter}
        >
          <Typography group="ui" variant="chip__badge">
            Filter by
          </Typography>
          <Icon data={filter_list} size={16} />
        </StyledChip>

        <StyledChip
          onClick={() => (openSort ? onClickCloseSort() : onClickOpenSort())}
          ref={sortRef}
          $active={openSort}
        >
          <Typography group="ui" variant="chip__badge">
            Sort by
          </Typography>
          <Icon data={sort} size={16} />
        </StyledChip>
      </FilterContainer>

      {openFilter && (
        <StyledMenu
          open={openFilter}
          anchorEl={filterRef.current}
          placement="bottom-start"
          ref={filterMenuRef}
        >
          <Heading>
            <Typography group="navigation" variant="label">
              Filter notifications
            </Typography>
          </Heading>
          <MenuItem onClick={() => handleFilter(FilterNotification.USER)}>
            <Icon
              data={
                selectedFilter[FilterNotification.USER]
                  ? checkbox
                  : checkbox_outline
              }
            />
            <Typography> User messages </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleFilter(FilterNotification.SYSTEM)}>
            <Icon
              data={
                selectedFilter[FilterNotification.SYSTEM]
                  ? checkbox
                  : checkbox_outline
              }
            />
            <Typography> System messages </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleFilter(FilterNotification.UNREAD)}>
            <Icon
              data={
                selectedFilter[FilterNotification.UNREAD]
                  ? checkbox
                  : checkbox_outline
              }
            />
            <Typography> Unread </Typography>
          </MenuItem>
        </StyledMenu>
      )}
      {openSort && (
        <StyledMenu
          open={openSort}
          anchorEl={sortRef.current}
          placement="bottom-start"
          ref={sortMenuRef}
        >
          <Heading>
            <Typography group="navigation" variant="label">
              Sort notifications
            </Typography>
          </Heading>
          <MenuItem onClick={() => handleSorting(SortNotification.NEW_OLDEST)}>
            <Icon
              data={
                selectedSort[SortNotification.NEW_OLDEST]
                  ? checkbox
                  : checkbox_outline
              }
            />
            <Typography> Newest to oldest </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleSorting(SortNotification.OLD_NEWEST)}>
            <Icon
              data={
                selectedSort[SortNotification.OLD_NEWEST]
                  ? checkbox
                  : checkbox_outline
              }
            />
            <Typography> Oldest to newest </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleSorting(SortNotification.UNREAD)}>
            <Icon
              data={
                selectedSort[SortNotification.UNREAD]
                  ? checkbox
                  : checkbox_outline
              }
            />
            <Typography> Unread</Typography>
          </MenuItem>
        </StyledMenu>
      )}
    </>
  );
};

export default FilterOptions;
