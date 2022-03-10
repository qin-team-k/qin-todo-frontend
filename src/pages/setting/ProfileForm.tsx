import { useAuthUser } from "next-firebase-auth";
import type { VFC } from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useFile } from "./useFile";
import { useUpsertUser } from "./useUpsertUser";
import { Avatar } from "src/components/Avatar";
import { Button } from "src/components/Button";
import { Input } from "src/components/Form";
import { useUser } from "src/util/user";

export type UserForm = { accountName: string; userName: string };

type ProfileFormProps = { accountName?: string; userName?: string };

export const ProfileForm: VFC<ProfileFormProps> = () => {
  const authUser = useAuthUser();
  const handleSignOut = useCallback(() => {
    return authUser.signOut();
  }, [authUser]);
  const { user } = useUser();
  const {
    selectedFile,
    imageUrl,
    imageRef,
    handleChangeFile,
    handleOpenFileDialog,
  } = useFile();
  const { isUpserting, upsertUser } = useUpsertUser(selectedFile);
  const { register, handleSubmit, formState } = useForm<UserForm>({
    defaultValues: {
      accountName: user?.username ?? authUser.displayName ?? "",
      userName: user?.username ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(upsertUser)}>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex justify-start items-center space-x-6">
            <div className="flex flex-col">
              <label className="block mb-1 text-sm font-bold text-gray-400">
                アイコン
              </label>
              <Avatar
                noDialog
                src={imageUrl ?? user?.avatarUrl ?? authUser.photoURL ?? ""}
                alt={user?.username}
                width={96}
                height={96}
                className="w-24 h-24"
              />
            </div>
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              onChange={handleChangeFile}
              accept="image/png, image/jpeg"
            />
            <Button
              variant="solid-gray"
              className="py-2.5 px-5 mt-4"
              onClick={handleOpenFileDialog}
            >
              変更する
            </Button>
          </div>
        </div>

        <Input
          label="名前"
          {...register("accountName", {
            required: { value: true, message: "入力必須です" },
            maxLength: { value: 64, message: "64文字以下にする必要があります" },
            minLength: { value: 2, message: "2文字以上にする必要があります" },
          })}
          error={formState.errors.accountName?.message}
        />
      </div>

      <div className="mt-12 space-y-4">
        {user ? (
          <Button
            type="submit"
            variant="solid-blue"
            className="p-3 w-full"
            disabled={isUpserting}
          >
            保存する
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              variant="solid-blue"
              className="p-3 w-full"
              disabled={isUpserting}
            >
              登録してはじめる
            </Button>
            <Button
              variant="solid-gray"
              className="p-3 w-full"
              onClick={handleSignOut}
            >
              登録せずに終了する
            </Button>
          </>
        )}
      </div>
    </form>
  );
};
