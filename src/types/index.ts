export type TodoType = {
  id: string;
  content: string;
  createdAt: Date;
  done: boolean;
  status: "TODAY" | "TOMORROW" | "NEXT";
  updatedAt: Date;
  userId: string;
};

export type UserType = {
  id: string;
  uid: string;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
