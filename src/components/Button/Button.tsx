import { ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
};

export const Button: VFC<Props> = ({ children }) => {
  return (
    <button
      type="button"
      className="py-2 px-5 text-sm font-bold text-white bg-primary-blue rounded-full ease-in-out"
    >
      {children}
    </button>
  );
};
