import type { NextPage } from "next";
import { Todos } from "@/components/Todos";
import { useTodosSwr } from "@/fetch/useTodosSwr";

const Home: NextPage = () => {
  const { data, isLoading, isError } = useTodosSwr();

  if (isLoading) return <div>Loading</div>;

  return (
    <div>
      <main className="mx-auto mt-20 max-w-4xl">
        <h1 className="my-10 text-4xl font-bold">Qin Todo</h1>
        <div className="flex space-x-10">
          <div className="w-[300px]">
            <h2 className="mb-5 text-2xl font-bold">今日する</h2>
            <Todos todos={data} status="TODAY" />
          </div>
          <div className="w-[300px]">
            <h2 className="mb-5 text-2xl font-bold">明日する</h2>
            <Todos todos={data} status="TOMORROW" />
          </div>
          <div className="w-[300px]">
            <h2 className="mb-5 text-2xl font-bold">今度する</h2>
            <Todos todos={data} status="NEXT" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
