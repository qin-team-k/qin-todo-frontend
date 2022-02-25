export type Todo = {
  content: string;
  createdAt: Date;
  done: boolean;
  id: number;
  status: "TODAY" | "TOMORROW" | "NEXT";
  updatedAt: Date;
  userId: string;
};
