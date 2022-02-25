import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DuplicateIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";
import { FC } from "react";
import { mutate } from "swr";
import { Todo } from "../types";

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

  const handleToggle = async (id: string) => {
    await axios.put(`http://localhost:3000/v1/todos/${id}/toggle`);
    mutate("http://localhost:3000/v1/todos");
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:3000/v1/todos/${id}`);
    mutate("http://localhost:3000/v1/todos");
  };

  const handleDuplicate = async (id: string) => {
    await axios.post(`http://localhost:3000/v1/todos/${id}/duplicate`);
    mutate("http://localhost:3000/v1/todos");
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`flex justify-between`}>
        <div className="flex items-center pl-1 space-x-1">
          <input
            className="focus:outline-none"
            type="checkbox"
            checked={todo.done}
            onChange={() => handleToggle(todo.id)}
          />
          <label className={`${todo.done ? "line-through" : null} opacity-50`}>
            {todo.content}
          </label>
        </div>
        <div className="flex">
          <button onClick={() => handleDuplicate(todo.id)}>
            <DuplicateIcon className="h-5" />
          </button>
          <button onClick={() => handleDelete(todo.id)}>
            <TrashIcon className="h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
