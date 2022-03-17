import { useAuthUser } from "next-firebase-auth";
import useSWRImmutable from "swr/immutable";
import { API_URL } from "src/api/endpoint";
import { UserType } from "src/types";

export const useUser = () => {
  const authUser = useAuthUser();

  const {
    data: user,
    mutate: setUser,
    error,
    ...rest
  } = useSWRImmutable<UserType>(authUser.id ? `${API_URL}/users` : null);

  return {
    user,
    setUser,
    isLoading: !user && !error,
    error,
    ...rest,
  };
};
