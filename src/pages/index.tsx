import {
  closestCorners,
  CollisionDetection,
  DndContext,
  PointerSensor,
  useDroppable,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  SortingStrategy,
} from "@dnd-kit/sortable";
import { PlusCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { SortableItem } from "@/components/SortableItem";
import { Todo } from "@/types";

type Items = Record<string, Todo[]>;
type Props = {
  collisionDetection?: CollisionDetection;
  strategy?: SortingStrategy;
};

type Payload = {
  content: string;
  status: string;
};

function insert<T>(arr: T[], index: number, elem: T) {
  const copy = arr.slice();
  copy.splice(index, 0, elem);
  return copy;
}

const DroppableContainer = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
  items: string[];
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <ul ref={setNodeRef}>
      <div className="grid gap-4">{children}</div>
    </ul>
  );
};

const Broadcasting = ({
  collisionDetection = closestCorners,
  strategy = verticalListSortingStrategy,
}: Props) => {
  const getContainerName = (key: string): string => {
    switch (key) {
      case "TODAY":
        return "今日する";
      case "TOMORROW":
        return "明日する";
      case "NEXT":
        return "今度する";
      default:
        return "";
    }
  };

  const { data, error } = useSWR<Todo[]>(`http://localhost:3000/v1/todos`);
  const todayTodo = data?.filter((todo) => todo.status === "TODAY");
  const tomorrowTodo = data?.filter((todo) => todo.status === "TOMORROW");
  const nextTodo = data?.filter((todo) => todo.status === "NEXT");

  const [isAdding, setIsAdding] = useState(false);
  const [items, setItems] = useState<Items>();

  useEffect(() => {
    if (todayTodo && tomorrowTodo && nextTodo) {
      setItems({
        TODAY: todayTodo,
        TOMORROW: tomorrowTodo,
        NEXT: nextTodo,
      });
    }
  }, [data]);

  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const [_activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const findContainer = (id: string) => {
    let container;
    if (items) {
      if (id in items) {
        return id;
      }
      container = Object.keys(items).find((key) =>
        items[key].find((value) => value.id === id)
      );
    }
    return container;
  };

  const handleDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  const { register, handleSubmit } = useForm<Payload>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const handleOnSubmit: SubmitHandler<Payload> = async (data) => {
    console.log(data);

    if (data.content === "") return;
    await axios.post("http://localhost:3000/v1/todos", {
      content: data.content,
      status: status,
    });
    mutate("http://localhost:3000/v1/todos");
  };

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  return (
    <div className="mx-auto max-w-6xl">
      {items && (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={({ active }) => {
            setActiveId(active.id);
            setClonedItems(items);
          }}
          onDragOver={({ active, over }) => {
            const overId = over?.id as string;
            if (!overId) {
              return;
            }

            const overContainer = findContainer(overId);
            const activeContainer = findContainer(active.id);

            if (!overContainer || !activeContainer) {
              return;
            }

            if (activeContainer !== overContainer) {
              setItems((items) => {
                if (items) {
                  const activeItems = items[activeContainer];
                  const overItems = items[overContainer];

                  const overIndex = overItems.findIndex(
                    (item) => item.id === overId
                  );

                  const activeIndex = activeItems.findIndex(
                    (item) => item.id === active.id
                  );

                  let newIndex: number;

                  if (overId in items) {
                    newIndex = overItems.length + 1;
                  } else {
                    console.log({ activeReactCurrent: active.rect.current });

                    const isBelowLastItem =
                      over &&
                      overIndex === overItems.length - 1 &&
                      active.rect.current.translated;

                    const modifier = isBelowLastItem ? 1 : 0;

                    newIndex =
                      overIndex >= 0
                        ? overIndex + modifier
                        : overItems.length + 1;
                  }

                  return {
                    ...items,
                    [activeContainer]: [
                      ...items[activeContainer].filter(
                        (item) => item.id !== active.id
                      ),
                    ],
                    [overContainer]: insert(
                      items[overContainer],
                      newIndex,
                      items[activeContainer][activeIndex]
                    ),
                  };
                }
              });
            }
          }}
          onDragEnd={({ active, over }) => {
            const activeContainer = findContainer(active.id);
            if (!activeContainer) {
              setActiveId(null);
              return;
            }

            const overId = over?.id as string;
            const overContainer = findContainer(overId);

            if (overContainer) {
              const activeIndex = items[activeContainer].findIndex(
                (item) => item.id === active.id
              );
              const overIndex = items[overContainer].findIndex(
                (item) => item.id === overId
              );

              if (activeIndex !== overIndex) {
                setItems((items) => ({
                  ...items,
                  [overContainer]: arrayMove(
                    items![overContainer],
                    activeIndex,
                    overIndex
                  ),
                }));
              }
            }

            setActiveId(null);
          }}
          onDragCancel={handleDragCancel}
        >
          <div className="inline-grid grid-cols-3 gap-12 items-start w-[800px] h-screen">
            {Object.entries(items).map(([key, values]) => (
              <SortableContext key={key} items={values} strategy={strategy}>
                <DroppableContainer
                  id={key}
                  items={values.map((value) => value.id)}
                >
                  <h1 className="py-4 text-xl font-bold">
                    {getContainerName(key)}
                  </h1>
                  {values.map((todo) => (
                    <SortableItem key={todo.id} todo={todo} />
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
                        <button
                          className="text-gray-400"
                          onClick={() => setIsAdding(true)}
                        >
                          タスクを追加する
                        </button>
                      </div>
                    )}
                  </div>
                </DroppableContainer>
              </SortableContext>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default Broadcasting;
