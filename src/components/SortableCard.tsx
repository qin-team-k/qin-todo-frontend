import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { VFC } from "react";

type Props = {
  todo: {
    id: string;
    content: string;
    status: string;
  };
};

export const SortableCard: VFC<Props> = ({ todo }) => {
  const { listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners}>
      <h1>{todo.content}</h1>
    </div>
  );
};
