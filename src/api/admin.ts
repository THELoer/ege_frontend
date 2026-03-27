import { api } from "./client";
import type { TaskContentOrder } from "../types/Task";

export const uploadTasksFile = (data: {
  file: File;
  number: string;
  type: string;
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
  type: string;
  condition: string | null;
  imageUrl: string | null;
  contentOrder: TaskContentOrder;
  answer: string;
  solution: string | null;
}) => api.post("/admin/tasks", payload);
