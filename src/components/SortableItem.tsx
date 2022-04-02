import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuthUser } from "next-firebase-auth";
import Image from "next/image";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { Todo } from "../types";

type Props = {
  todo: Todo;
};

type Payload = {
  content: string;
};

export const SortableItem: FC<Props> = ({ todo }) => {
  const authUser = useAuthUser();
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
    const idToken = await authUser.getIdToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos/${id}/toggle`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${idToken}`,
        "content-type": "application/json",
      },
      // FIXME なぜかbodyが必要
      body: JSON.stringify({
        id,
      }),
    });
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos`);
  };

  const handleDelete = async (id: string) => {
    const idToken = await authUser.getIdToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${idToken}`,
        "content-type": "application/json",
      },
    });

    mutate(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos`);
  };

  const handleDuplicate = async (id: string) => {
    const idToken = await authUser.getIdToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos/${id}/duplicate`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${idToken}`,
        "content-type": "application/json",
      },
      // FIXME なぜかbodyが必要
      body: JSON.stringify({
        id,
      }),
    });
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos`);
  };

  const handleOnSubmit = async () => {
    const idToken = await authUser.getIdToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${idToken}`,
        "content-type": "application/json",
      },
      // FIXME なぜかbodyが必要
      body: JSON.stringify({
        content,
      }),
    });
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/v1/todos`);
    setIsAdding(false);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`flex justify-between`}>
        <div className="flex items-center space-x-2">
          <input
            className="float-left w-[24px] h-[24px] bg-white checked:bg-primary-rose bg-center bg-no-repeat bg-contain rounded-full border border-gray-300 focus:outline-none transition duration-200 appearance-none cursor-pointer"
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
              {todo.content}
              {/* {`${todo.id}:${todo.content}`} */}
            </button>
          )}
        </div>
        <div className="flex space-x-2">
          <button onClick={() => handleDuplicate(todo.id)}>
            <Image
              src="/duplicate.svg"
              alt="duplicate"
              width={15}
              height={15}
            />
          </button>
          <button onClick={() => handleDelete(todo.id)}>
            <Image src="/trash.svg" alt="trash" width={15} height={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
