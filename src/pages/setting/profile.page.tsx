import type { NextPage } from "next";
import { ProfileForm } from "./ProfileForm";
import { SettingHeader } from "src/components/SettingHeader";
import { Layout } from "src/layout";
import { useUser, withUser } from "src/util/user";

const Profile: NextPage = () => {
  const { isLoading } = useUser();

  return (
    <div>
      <SettingHeader text="プロフィール" href="/setting/edit" />
      <Layout center="account">
        <div>{isLoading ? null : <ProfileForm />}</div>
      </Layout>
    </div>
  );
};

export default withUser(Profile);
