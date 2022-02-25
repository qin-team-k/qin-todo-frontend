import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy, // <== doesn't break if this is rectSortingStrategy
} from "@dnd-kit/sortable";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { SortableCard } from "@/components/SortableCard";

type Todo = {
  id: string;
  content: string;
  status: string;
};

const Test: NextPage = () => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { data, error } = useSWR(`http://localhost:3000/v1/todos`);
  const [items, setItems] = useState<Todo[]>(data);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items
          .map((item) => item.id === active.id)
          .indexOf(true);
        console.log({ oldIndex });

        const newIndex = items.map((item) => item.id === over.id).indexOf(true);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!items) return <div>Loading</div>;

  return (
    <DndContext
      autoScroll={false}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items?.map((item) => (
          <SortableCard key={item.id} todo={item} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default Test;
