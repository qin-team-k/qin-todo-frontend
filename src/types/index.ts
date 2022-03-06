export type Todo = {
  id: string;
  content: string;
  createdAt: Date;
  done: boolean;
  status: "TODAY" | "TOMORROW" | "NEXT";
  updatedAt: Date;
  userId: string;
};

export type User = {
  id: string;
  avatarUrl: string;
  createdAt: Date;
  email: string;
  updatedAt: Date;
  username: string;
};
