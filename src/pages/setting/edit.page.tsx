import type { NextPage } from "next";
import { SettingHeader } from "src/components/SettingHeader";
import { SettingRow } from "src/components/SettingRow";
import { Layout } from "src/layout";
import { useUser, withUser } from "src/util/user";

const Profile: NextPage = () => {
  const { isLoading } = useUser();

  return (
    <div>
      <SettingHeader text="設定" href="/" />
      <Layout center="account">
        <div className="mb-20 space-y-5">
          <h2 className="block mb-1 text-sm font-bold text-gray-400">設定</h2>
          <SettingRow text="プロフィール" href="/setting/profile" />
          <SettingRow text="アカウント" href="/setting/account" />
          <SettingRow text="テーマ" href="/setting/theme" />
        </div>
        <div className="space-y-5">
          <h2 className="block mb-1 text-sm font-bold text-gray-400">
            サポート
          </h2>
          <SettingRow
            text="プライバシーポリシー"
            href="/setting/support/privacy-policy"
          />
          <SettingRow text="利用規約" href="/setting/support/terms" />
          <SettingRow text="お問い合わせ" href="/setting/support/contact" />
        </div>
      </Layout>
    </div>
  );
};

export default withUser(Profile);
