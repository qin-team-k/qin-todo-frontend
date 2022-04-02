/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { useAuthUser } from "next-firebase-auth";
import { Fragment, useCallback, VFC } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  modalType: "logout" | "delete";
};

export const Modal: VFC<Props> = ({ isOpen, setIsOpen, modalType }) => {
  const authUser = useAuthUser();

  const handleSignOut = useCallback(() => {
    return authUser.signOut();
  }, [authUser]);

  const handleDeleteUser = async () => {
    const idToken = await authUser.getIdToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/delete`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${idToken}`,
        "content-type": "application/json",
      },
    });
    authUser.signOut();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-10"
        onClose={setIsOpen}
      >
        <div className="flex justify-center items-end px-4 pt-4 pb-20 min-h-screen text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden relative px-2 pt-5 pb-4 text-left align-bottom bg-white rounded-xl shadow-xl transition-all sm:py-6 sm:px-3 sm:my-8 sm:w-full sm:max-w-md sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-gray-900"
                  >
                    {modalType === "logout" ? "ログアウト" : "アカウントの削除"}
                  </Dialog.Title>
                  <div className="mt-2 mb-5">
                    {modalType === "logout" ? (
                      <p>ログアウトしてよろしいですか?</p>
                    ) : (
                      <p>アカウントを完全に削除してよろしいですか?</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:flex sm:flex-row-reverse sm:mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-5 w-full text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-full focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={
                    modalType === "logout" ? handleSignOut : handleDeleteUser
                  }
                >
                  {modalType === "logout" ? "ログアウト" : "削除"}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-5 mt-3 w-full text-base font-medium text-gray-700 hover:text-gray-500 bg-gray-200 rounded-full focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
