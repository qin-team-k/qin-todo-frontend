import { ChevronRightIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { VFC } from "react";

type Props = {
  text: string;
  href: string;
};

export const SettingRow: VFC<Props> = (props) => {
  const { text, href } = props;
  return (
    <div>
      <Link href={href}>
        <a>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-gray-700">{text}</h2>
            {text === "お問い合わせ" ? (
              <div>
                <ExternalLinkIcon className="w-5 text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center">
                {text === "テーマ" ? (
                  <h3 className="mr-5 font-bold text-gray-700">
                    OSの設定に合わせる
                  </h3>
                ) : null}
                <ChevronRightIcon className="w-5 text-gray-400" />
              </div>
            )}
          </div>
        </a>
      </Link>
    </div>
  );
};
