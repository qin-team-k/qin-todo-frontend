import type { ReactNode, VFC } from "react";

import type { HeaderProps } from "./Header";

type Props = HeaderProps & { children: ReactNode; isHeaderNarrow?: boolean };

export const Layout: VFC<Props> = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { children, ...rest } = props;

  return (
    <div className="space-y-8 sm:space-y-14">
      <main className="px-4 mx-auto w-full max-w-screen-sm">{children}</main>
    </div>
  );
};
