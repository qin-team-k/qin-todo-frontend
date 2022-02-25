import useSWR from "swr";
import { fetcher } from "./fetcher";

export const useTodosSwr = () => {
  const { data, error } = useSWR(`http://localhost:3000/v1/todos`, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
