import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DuplicateIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";
import { ChangeEvent, FC, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { Todo } from "../types";

type Props = {
  todo: Todo;
};

type Payload = {
  content: string;
};

export const SortableItem: FC<Props> = ({ todo }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState(todo.content);
  const { register, handleSubmit, control } = useForm();

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

  const handleOnSubmit = async () => {
    await axios.put(`http://localhost:3000/v1/todos/${todo.id}`, {
      content: content,
    });
    mutate("http://localhost:3000/v1/todos");
    setIsAdding(false);
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
          {isAdding ? (
            <div className="flex">
              <input
                type="text"
                name="content"
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                className="py-1 px-2 text-white bg-red-500 rounded-md"
                type="button"
                onClick={handleOnSubmit}
              >
                edit
              </button>
            </div>
          ) : (
            <button
              className={`${todo.done ? "line-through" : null} opacity-50`}
              onClick={() => setIsAdding(true)}
            >
              {/* {todo.content} */}
              {`${todo.id}:${todo.content}`}
            </button>
          )}
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
