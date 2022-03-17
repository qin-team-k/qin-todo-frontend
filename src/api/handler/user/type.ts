export type UserType = {
  id: string;
  uid: string;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
};

export const isUserType = (data: any): data is UserType => {
  return data.id !== undefined;
};
