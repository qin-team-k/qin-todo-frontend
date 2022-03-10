import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import { SettingHeader } from "src/components/SettingHeader";
import { Layout } from "src/layout";
import { withUser } from "src/util/user";

const Account: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"logout" | "delete">("logout");

  const handleDeleteModalOpen = () => {
    setIsOpen(true);
    setModalType("delete");
  };

  const handleLogoutModalOpen = () => {
    setIsOpen(true);
    setModalType("logout");
  };

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
            onClick={handleLogoutModalOpen}
          >
            ログアウト
          </button>
          <button
            className="block mr-5 font-bold text-danger-red"
            onClick={handleDeleteModalOpen}
          >
            アカウントの削除
          </button>
          <Modal modalType={modalType} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </Layout>
    </div>
  );
};

export default withUser(Account);
