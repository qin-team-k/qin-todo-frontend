import {
  DuplicateIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import { useState, VFC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { Todo } from "@/types";

type Props = {
  todos: Todo[];
  status: string;
};

type Payload = {
  content: string;
  status: string;
};

export const Todos: VFC<Props> = ({ todos, status }) => {
  const [isAdding, setIsAdding] = useState(false);

  const { register, handleSubmit } = useForm<Payload>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleOnSubmit: SubmitHandler<Payload> = async (data) => {
    if (data.content === "") return;
    await axios.post("http://localhost:3000/v1/todos", {
      content: data.content,
      status: status,
    });
    mutate("http://localhost:3000/v1/todos");
  };

  const handleToggle = async (id: number) => {
    await axios.put(`http://localhost:3000/v1/todos/${id}/toggle`);
    mutate("http://localhost:3000/v1/todos");
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3000/v1/todos/${id}`);
    mutate("http://localhost:3000/v1/todos");
  };

  const handleDuplicate = async (id: number) => {
    await axios.post(`http://localhost:3000/v1/todos/${id}/duplicate`);
    mutate("http://localhost:3000/v1/todos");
  };

  return (
    <div>
      {todos.map((todo: Todo) => (
        <div key={todo.id}>
          {todo.status === status && (
            <div className={`flex justify-between`}>
              <div className="flex items-center pl-1 space-x-1">
                <input
                  className="focus:outline-none"
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
                <label
                  className={`${todo.done ? "line-through" : null} opacity-50`}
                >
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
          )}
        </div>
      ))}
      <div>
        {isAdding ? (
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="flex items-center pl-1 space-x-1">
              <input className="focus:outline-none" type="radio" />
              <input
                className="focus:outline-none"
                type="text"
                placeholder="タスクを追加する"
                {...register("content")}
                autoFocus
              />
            </div>
          </form>
        ) : (
          <div className="flex items-center">
            <PlusCircleIcon className="h-5 text-gray-400" />
            <button className="text-gray-400" onClick={() => setIsAdding(true)}>
              タスクを追加する
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
