import { ChevronLeftIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { VFC } from "react";

type Props = {
  text: string;
  href: string;
};

export const SettingHeader: VFC<Props> = (props) => {
  const { text, href } = props;
  return (
    <div className="py-10">
      <header className="px-4 mx-auto w-full max-w-screen-md">
        <div className="flex relative justify-center items-center mb-10">
          <Link href={href}>
            <a>
              {text === "設定" ? (
                <XIcon className="absolute top-0.5 left-0 w-6 text-xl text-gray-700" />
              ) : (
                <ChevronLeftIcon className="absolute top-0 left-0 mt-1 w-7 text-xl text-gray-700" />
              )}
            </a>
          </Link>
          <h1 className="text-xl font-bold">{text}</h1>
        </div>
      </header>
    </div>
  );
};
