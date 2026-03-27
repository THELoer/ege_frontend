import { api } from "./client";
<<<<<<< codex/implement-frontend-for-math-exam-site-mipl1c
import type { TaskContentOrder } from "../types/Task";
=======
import type { TaskContentOrder, TaskType } from "../types/Task";
>>>>>>> master

export const uploadTasksFile = (data: {
  file: File;
  number: string;
<<<<<<< codex/implement-frontend-for-math-exam-site-mipl1c
  type: string;
=======
  type: TaskType;
>>>>>>> master
  part: "1" | "2";
}) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("number", data.number);
  formData.append("type", data.type);
  formData.append("part", data.part);

  return api.post("/admin/tasks/upload", formData);
};

export const createTask = (payload: {
  number: number;
  part: number;
<<<<<<< codex/implement-frontend-for-math-exam-site-mipl1c
  type: string;
=======
  type: TaskType;
>>>>>>> master
  condition: string | null;
  imageUrl: string | null;
  contentOrder: TaskContentOrder;
  answer: string;
  solution: string | null;
}) => api.post("/admin/tasks", payload);
