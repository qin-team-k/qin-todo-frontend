import { Menu, Transition } from "@headlessui/react";
import { CogIcon, LogoutIcon } from "@heroicons/react/outline";
import { useAuthUser } from "next-firebase-auth";
import Image from "next/image";
import { Fragment, useCallback } from "react";
import { useUser } from "src/util/user";

export const Header = () => {
  const { user } = useUser();
  const authUser = useAuthUser();
  const handleSignOut = useCallback(() => {
    return authUser.signOut();
  }, [authUser]);

  return (
    <div className="py-[28px] mx-auto mb-[64px] w-[1048px]">
      <div className="flex justify-between items-center">
        <Image
          src="/qin_todo_logo.svg"
          alt="qin-todo-logo"
          width={113}
          height={24}
        />
        {user && (
          <div>
            <Menu as="div" className="inline-block relative text-left">
              <div>
                <Menu.Button>
                  <Image
                    className="rounded-full"
                    src={user.avatarUrl}
                    alt="qin-todo-logo"
                    width={34}
                    height={34}
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md divide-y divide-gray-100 focus:outline-none ring-1 ring-black/5  shadow-lg">
                  <div className="p-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "text-white bg-primary-rose"
                              : "text-gray-900"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm font-bold`}
                        >
                          {active ? (
                            <CogIcon
                              className="mr-2 w-5 h-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <CogIcon
                              className="mr-2 w-5 h-5"
                              aria-hidden="true"
                            />
                          )}
                          設定
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-primary-rose text-white"
                              : "text-primary-rose"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm font-bold text-white`}
                          onClick={handleSignOut}
                        >
                          {active ? (
                            <LogoutIcon
                              className="mr-2 w-5 h-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <LogoutIcon
                              className="mr-2 w-5 h-5"
                              aria-hidden="true"
                            />
                          )}
                          ログアウト
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};
