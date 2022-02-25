export type Todo = {
  id: string;
  content: string;
  createdAt: Date;
  done: boolean;
  status: "TODAY" | "TOMORROW" | "NEXT";
  updatedAt: Date;
  userId: string;
};
