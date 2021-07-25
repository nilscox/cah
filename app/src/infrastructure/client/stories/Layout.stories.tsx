import React, { useState } from 'react';

import { Meta } from '@storybook/react';
import styled from 'styled-components';

import { createPlayer } from '../../../tests/factories';
import Header from '../components/domain/Header';
import { DragHandle, RenderItemFunction, SortableList } from '../components/elements/SortableList';

export default {
  title: 'Layout',
} as Meta;

export const HeaderStory = () => <Header player={createPlayer()} />;

HeaderStory.storyName = 'Header';

const ItemContainer = styled.div<{ tall: boolean; isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${({ tall }) => (tall ? '40px' : undefined)};
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  visibility: ${({ isSelected }) => (isSelected ? 'hidden' : undefined)};
`;

type ItemType = {
  id: string;
  text: string;
};

type ItemProps = {
  item: ItemType;
  isSelected: boolean;
  dragHandle: DragHandle;
};

const Item: React.FC<ItemProps> = ({ item, dragHandle, ...props }) => (
  <ItemContainer {...props} tall={['2', '5', '11'].includes(item.id)}>
    <div style={{ flex: 1 }}>{item.text}</div>
    <div {...dragHandle}>Drag me!</div>
  </ItemContainer>
);

/* eslint-disable react-hooks/rules-of-hooks */

export const sortableList = () => {
  const [items, setItems] = useState(
    Array(12)
      .fill(null)
      .map((_, n) => ({ id: String(n), text: `item ${n}` })),
  );

  const renderItem: RenderItemFunction<ItemType> = (item, isSelected, dragHandle) => (
    <Item item={item} isSelected={isSelected} dragHandle={dragHandle} />
  );

  return (
    <div style={{ height: '100%', maxHeight: 360, overflowY: 'auto' }}>
      <SortableList items={items} renderItem={renderItem} onOrderChange={setItems} />
    </div>
  );
};

HeaderStory.storyName = 'Header';
