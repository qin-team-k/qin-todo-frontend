import { useAuthUser } from "next-firebase-auth";
import useSWRImmutable from "swr/immutable";
import { UserType } from "src/types";

export const useUser = () => {
  const authUser = useAuthUser();
  const API_URL = process.env.API_URL;
  const {
    data: user,
    mutate: setUser,
    error,
    ...rest
  } = useSWRImmutable<UserType>(authUser.id ? `${API_URL}/auth/profile` : null);

  return {
    user,
    setUser,
    isLoading: !user && !error,
    error,
    ...rest,
  };
};
