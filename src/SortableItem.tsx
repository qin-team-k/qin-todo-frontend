import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FC } from "react";
import { Todo } from "./types";

type Props = {
  todo: Todo;
};

export const SortableItem: FC<Props> = ({ todo }) => {
  const sortable = useSortable({
    id: todo.id,
  });
  const { attributes, setNodeRef, listeners, transform, transition } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="z-10">
        <span className="text-lg">{todo.content}</span>
      </div>
    </div>
  );
};
