import type { NextPage } from "next";
import { useAuthUser } from "next-firebase-auth";
import Image from "next/image";
import { useCallback } from "react";
import { Button } from "src/components/Button";
import { SettingHeader } from "src/components/SettingHeader";
import { Layout } from "src/layout";

import { withUser } from "src/util/user";

const Account: NextPage = () => {
  const authUser = useAuthUser();
  const handleSignOut = useCallback(() => {
    return authUser.signOut();
  }, [authUser]);

  return (
    <div>
      <SettingHeader text="アカウント" href="/setting/edit" />
      <Layout center="account">
        <div className="mb-20 space-y-5">
          <h2 className="block mb-1 text-sm font-bold text-gray-400">
            アカウントの連携
          </h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Image
                src="/google-l.svg"
                alt="google-logo"
                height={22}
                width={22}
              />
              <h3 className="mr-5 font-bold text-gray-700">Google</h3>
            </div>
            <Button>解除する</Button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Image
                src="/apple-l.svg"
                alt="apple-logo"
                height={22}
                width={22}
              />
              <h3 className="mr-5 font-bold text-gray-700">Apple</h3>
            </div>
            <Button>連携する</Button>
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="block mb-1 text-sm font-bold text-gray-400">
            アカウントの操作
          </h2>
          <button
            className="block mr-5 font-bold text-danger-red"
            onClick={handleSignOut}
          >
            ログアウト
          </button>
          <button className="block mr-5 font-bold text-danger-red">
            アカウントの削除
          </button>
        </div>
      </Layout>
    </div>
  );
};

export default withUser(Account);
