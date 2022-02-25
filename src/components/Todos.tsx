import {
  DuplicateIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";
import { useState, VFC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTodo } from "@/hooks/useTodo";
import { Todo } from "@/types";

type Props = {
  todos: Todo[];
  status: string;
};

type ValuesType = {
  content: string;
};

export const Todos: VFC<Props> = ({ todos, status }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { toggleDone } = useTodo();

  const { register, handleSubmit } = useForm<ValuesType>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleOnSubmit: SubmitHandler<ValuesType> = (data) => {
    if (data.content === "") return;
  };

  return (
    <div>
      {todos.map((todo: Todo) => (
        <div key={todo.id}>
          {todo.status === status && (
            <div className="flex justify-between">
              <div className="flex items-center pl-1 space-x-1">
                <input
                  className="focus:outline-none"
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleDone(todo.id)}
                />
                <label className={`${todo.done ? "line-through" : null}`}>
                  {todo.content}
                </label>
              </div>
              <div className="flex">
                <button onClick={() => console.log("duplicated")}>
                  <DuplicateIcon className="h-5" />
                </button>
                <button onClick={() => console.log("deleted")}>
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
