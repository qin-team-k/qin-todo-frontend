import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import Image from "next/image";
import type { VFC } from "react";
import { AppleIcon, GoogleIcon } from "src/components/Icon";

type SignProps = { page: "signin" | "signup" };

const handleGoogleAuth = () => {
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();
  signInWithRedirect(auth, googleProvider);
};

const handleAppleAuth = () => {
  const provider = new OAuthProvider("apple.com");
  const auth = getAuth();
  signInWithRedirect(auth, provider);
};

export const Sign: VFC<SignProps> = (props) => {
  return (
    <div className="grid place-items-center w-screen h-screen bg-gray-200 dark:bg-gray-700">
      <div className="p-4">
        <div className="flex justify-center">
          <Image
            src="/qin_todo_logo.svg"
            alt="qin-todo-logo"
            width={170}
            height={37}
          />
        </div>
        <div className="mt-20 space-y-5">
          <button
            className="flex justify-center items-center py-4 w-72 font-bold bg-white rounded-full focus:outline-none"
            onClick={handleGoogleAuth}
          >
            <div className="flex">
              <GoogleIcon className="mr-3 w-6 h-6" />
              <span>Googleでログイン</span>
            </div>
          </button>

          <button
            className="flex justify-center items-center py-4 w-72 font-bold text-white bg-black rounded-full focus:outline-none"
            onClick={handleAppleAuth}
          >
            <div className="flex">
              <AppleIcon className="mr-3 w-6 h-6" />
              <span>Appleでログイン</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
