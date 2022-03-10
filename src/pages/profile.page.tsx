import type { NextPage } from "next";
import { useUser, withUser } from "src/util/user";

const Profile: NextPage = () => {
  const { user } = useUser();
  return (
    <div>
      <h2>{user?.email}</h2>
    </div>
  );
};

export default withUser(Profile);
