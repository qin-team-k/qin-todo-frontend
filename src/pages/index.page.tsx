import {
  closestCorners,
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
} from "@dnd-kit/sortable";
import { useAuthUser } from "next-firebase-auth";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Header } from "src/components/Header";
import { SortableItem } from "src/components/SortableItem";
import { TodoType } from "src/types";
import { withUser } from "src/util/user";

type Items = Record<string, TodoType[]>;

type DroppableContainerProps = {
  children: React.ReactNode;
  id: string;
};

function insert<T>(arr: T[], index: number, elem: T) {
  const copy = arr.slice();
  copy.splice(index, 0, elem);
  return copy;
}

const DroppableContainer = ({ children, id }: DroppableContainerProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <ul ref={setNodeRef}>
      <div className="grid gap-4">{children}</div>
    </ul>
  );
};

const Home = () => {
  const authUser = useAuthUser();
  const handleSignOut = useCallback(() => {
    return authUser.signOut();
  }, [authUser]);

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

  const { data, error } = useSWR<Items>(`http://localhost:3000/api/v1/todos`);

  const [items, setItems] = useState<Items>();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const [_activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const handleEnter = async (
    e: ChangeEvent<HTMLInputElement>,
    status: string
  ) => {
    if (e.target.value === "") return;
    if (e.key === "Enter") {
      const idToken = await authUser.getIdToken();
      await fetch("http://localhost:3000/api/v1/todos", {
        method: "POST",
        headers: {
          authorization: `Bearer ${idToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: e.target.value,
          status: status,
        }),
      });

      mutate("http://localhost:3000/api/v1/todos");
    }
  };

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col justify-center mx-auto max-w-[1440px]">
      <Header />
      {items && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
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
          onDragEnd={async ({ active, over }) => {
            const todoId = active.id;
            const distId = over?.data.current?.sortable.index;
            const containerId = active.data.current?.sortable.containerId;
            const getStatus = () => {
              switch (containerId) {
                case "Sortable-1":
                  return "TODAY";
                case "Sortable-3":
                  return "TOMORROW";
                case "Sortable-5":
                  return "NEXT";
                default:
                  return "";
              }
            };
            const status = getStatus();

            const activeTodo = items[status].find((item) => item.id === todoId);
            const isDone = activeTodo?.done;
            // FIXME indexを変える
            const idToken = await authUser.getIdToken();
            await fetch(`http://localhost:3000/api/v1/todos/${todoId}/order`, {
              method: "PUT",
              headers: {
                authorization: `Bearer ${idToken}`,
                "content-type": "application/json",
              },
              body: JSON.stringify({
                status,
                index: distId,
              }),
            });

            mutate("http://localhost:3000/api/v1/todos");

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
          <div className="inline-grid grid-cols-3 gap-24 items-start h-screen">
            {Object.entries(items).map(([key, values]) => (
              <SortableContext
                key={key}
                items={values}
                strategy={verticalListSortingStrategy}
              >
                <DroppableContainer id={key}>
                  {key === "TODAY" ? (
                    <h1 className="py-4 text-xl font-bold text-primary-rose">
                      {getContainerName(key)}
                    </h1>
                  ) : key === "TOMORROW" ? (
                    <h1 className="py-4 text-xl font-bold text-secondary-orange">
                      明日する
                    </h1>
                  ) : (
                    <h1 className="py-4 text-xl font-bold text-tertiary-yellow">
                      {getContainerName(key)}
                    </h1>
                  )}
                  {values.map((todo) => (
                    <SortableItem key={todo.id} todo={todo} />
                  ))}
                  <div className="flex items-center">
                    <Image
                      src="/plus-circle.svg"
                      alt="plus-circle"
                      width={24}
                      height={24}
                    />
                    <input
                      className="ml-2 focus:outline-none"
                      type="text"
                      placeholder="タスクを追加する"
                      onKeyPress={(e) => handleEnter(e, key)}
                    />
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

export default withUser(Home);
