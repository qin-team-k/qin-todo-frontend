import { useAuthUser } from "next-firebase-auth";
import { ChangeEvent, useRef, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { useUpsertUser } from "./useUpsertUser";
import { API_URL } from "src/api/endpoint";
import { Avatar } from "src/components/Avatar";
import { Input } from "src/components/Form";
import { useUser } from "src/util/user";

export type UserForm = { username: string; avatarUrl: string };

type ProfileFormProps = { accountName?: string; userName?: string };

export const ProfileForm: VFC<ProfileFormProps> = () => {
  const { user } = useUser();
  const authUser = useAuthUser();
  // FIXME こっから自分の記述
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();

  const imageRef = useRef<HTMLInputElement>(null);
  const handleOpenFileDialog = () => {
    imageRef.current?.click();
  };

  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.item(0);

    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const base64 = await fetch(url);
    const blob = await base64.blob();
    const formData = new FormData();
    formData.append("file", blob, file.name);

    // ユーザー情報の更新処理
    const idToken = await authUser.getIdToken();
    await fetch(`${API_URL}/users/${user?.id}/avatar`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${idToken}`,
        // "content-type": "multipart/form-data",
      },
      body: formData,
    });
  };

  const { isUpserting, upsertUser } = useUpsertUser(selectedFile);
  const { register, handleSubmit, formState } = useForm<UserForm>({
    defaultValues: { username: user?.username ?? "" },
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
              {/* <img
                className="w-24 h-24 rounded-full"
                src={imageUrl ?? user?.avatarUrl ?? authUser.photoURL ?? ""}
                alt="image"
              /> */}
              <Avatar
                noDialog
                src={imageUrl ?? user?.avatarUrl ?? authUser.photoURL ?? ""}
                alt={user?.username}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full"
              />
            </div>
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              onChange={handleChangeFile}
              accept="image/png, image/jpeg"
            />
            <button
              className="py-2.5 px-5 mt-4 text-sm font-bold bg-gray-300 rounded-full"
              onClick={handleOpenFileDialog}
            >
              変更する
            </button>
          </div>
        </div>

        <Input
          label="名前"
          {...register("username", {
            required: { value: true, message: "入力必須です" },
            maxLength: { value: 64, message: "64文字以下にする必要があります" },
            minLength: { value: 2, message: "2文字以上にする必要があります" },
          })}
          error={formState.errors.username?.message}
        />
      </div>

      <div className="mt-12 space-y-4">
        <button className="p-3 w-full font-bold text-white bg-primary-blue rounded-full">
          保存する
        </button>
      </div>
    </form>
  );
};
