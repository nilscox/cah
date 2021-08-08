import React, { ReactElement, useState } from 'react';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type DragHandle = DraggableSyntheticListeners;

export type SortableItem = {
  id: UniqueIdentifier;
};

export type RenderItemFunction<T extends SortableItem> = (
  item: T,
  isSorting: boolean,
  isBeingSorted: boolean,
  dragHandle: DragHandle,
) => ReactElement;

type SortableItemProps<T extends SortableItem> = {
  item: T;
  isBeingSorted: boolean;
  renderItem: RenderItemFunction<T>;
};

const SortableItem = <T extends SortableItem>({ item, isBeingSorted, renderItem }: SortableItemProps<T>) => {
  const { listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition as React.CSSProperties['transition'],
  };

  return (
    <div ref={setNodeRef} style={{ ...style, outline: 'none' }}>
      {renderItem(item, false, isBeingSorted, { ...listeners })}
    </div>
  );
};

type SortableListProps<T extends SortableItem> = {
  items: T[];
  renderItem: RenderItemFunction<T>;
  onOrderChange: (items: T[]) => void;
};

export const SortableList = <T extends SortableItem>({ items, renderItem, onOrderChange }: SortableListProps<T>) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find(({ id }) => id === activeId);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(({ id }) => id === active.id);
      const newIndex = items.findIndex(({ id }) => id === over?.id);

      onOrderChange(arrayMove(items, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item.id} isBeingSorted={item.id === activeId} item={item} renderItem={renderItem} />
        ))}
      </SortableContext>
      <DragOverlay>{active && renderItem(active, true, false, {})}</DragOverlay>
    </DndContext>
  );
};
