import type { NextPage } from "next";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Loader } from "src/components/Loader";

const Login: NextPage = () => {
  return (
    <div>
      <h2>profile</h2>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: Loader,
})(Login);
