import type { NextPage } from "next";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useMemo, VFC } from "react";
import { SWRConfig } from "swr";
import { useUser } from "./useUser";

export const useFetcher = () => {
  const authUser = useAuthUser();

  return useCallback(
    async (key: string) => {
      const idToken = await authUser.getIdToken();
      console.log(idToken);

      const res = await fetch(key, {
        headers: { authorization: `Bearer ${idToken}` },
      });

      if (!res.ok) {
        throw new Error();
      }
      const json = await res.json();
      return json;
    },
    [authUser]
  );
};

const NEW_USER_PAGE = "/setting/edit";
const WHITE_LIST_PAGES = ["/user/[userName]", "/memo/[noteId]", "/404"];

const UserController: VFC<{ children: ReactNode }> = (props) => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const isNewUserPage = useMemo(() => {
    return router.pathname === NEW_USER_PAGE;
  }, [router.pathname]);

  const isWhiteListPage = useMemo(() => {
    return WHITE_LIST_PAGES.includes(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (user && isNewUserPage) {
      router.push("/");
      return;
    }
    if (!user && !isNewUserPage) {
      router.push(NEW_USER_PAGE);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isNewUserPage, user]);

  if (user || isNewUserPage || isWhiteListPage) {
    return <>{props.children}</>;
  }

  return null;
};

export const withUser = (Component: NextPage<any>) => {
  return withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  })((props) => {
    const fetcher = useFetcher();

    return (
      <SWRConfig value={{ fetcher }}>
        {/* <UserController> */}
        <Component {...props} />
        {/* </UserController> */}
      </SWRConfig>
    );
  });
};
