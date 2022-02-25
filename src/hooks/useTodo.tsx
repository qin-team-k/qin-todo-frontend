import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

export const useTodo = () => {
  const { mutate } = useSWRConfig();
  const toggleDone = (id: number) => {
    axios.put(`http://localhost:3000/v1/todos/${id}/toggle`);
  };
  return { toggleDone };
};
