import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import type { UserForm } from "./ProfileForm";
import { API_URL } from "src/api/endpoint";
import { isUserType } from "src/api/handler/user/type";
import { useUser } from "src/util/user";

const createAvatarUrl = (uid: string) => {
  const filePath = encodeURIComponent(`thumbnails/${uid}_200x200`);
  return `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_URL}/${filePath}?alt=media`;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

export const useUpsertUser = (selectedFile?: File) => {
  const router = useRouter();
  const authUser = useAuthUser();
  const { user, setUser } = useUser();
  const [isUpserting, setIsUpserting] = useState(false);

  const onSubmit = useCallback(
    async (formData: UserForm) => {
      // 画像の登録処理;
      if (selectedFile) {
        const storage = getStorage();
        await uploadBytes(ref(storage, authUser.id), selectedFile);
        // TODO: 現在画像のリサイズに時間がかかっており、表示できなくなるため、あえて2秒待機させる
        await sleep(2000);
      }
      console.log(formData);

      // ユーザー情報の更新処理
      const idToken = await authUser.getIdToken();
      console.log(idToken);

      const res = await fetch(`${API_URL}/users/${user?.id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${idToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // avatarUrl: selectedFile
          //   ? createAvatarUrl(authUser.id)
          //   : user?.avatarUrl ?? authUser.photoURL,
        }),
      });

      // レスポンスの処理
      const data = await res.json();
      if (!isUserType(data)) {
        throw new Error();
      }
      return data;
    },
    [authUser, router, selectedFile, user]
  );

  const upsertUser = useCallback(
    async (formData: UserForm) => {
      setIsUpserting(true);
      await toast.promise(onSubmit(formData), {
        loading: "処理中",
        success: (data) => {
          setUser(data);
          setIsUpserting(false);
          return user ? "保存しました" : "登録しました";
        },
        error: (error) => {
          setIsUpserting(false);
          return error.message ?? "失敗しました";
        },
      });
    },
    [onSubmit, setUser, user]
  );

  return { isUpserting, upsertUser };
};
