import Image from "next/image";
import useSWR from "swr";
import { User } from "@/types";

export const Header = () => {
  const { data, error } = useSWR<User>(
    `http://localhost:3000/api/v1/auth/profile`
  );

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  return (
    <div className="py-[28px] mx-auto mb-[64px] w-[1048px]">
      <div className="flex justify-between items-center">
        <Image
          src="/qin_todo_logo.svg"
          alt="qin-todo-logo"
          width={113}
          height={24}
        />
        <Image
          className="rounded-full"
          src={data.avatarUrl}
          alt="qin-todo-logo"
          width={22}
          height={22}
        />
      </div>
    </div>
  );
};
