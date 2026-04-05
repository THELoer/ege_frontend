import { api } from "./client";
import type { TaskContentOrder } from "../types/Task";

export interface AdminTaskListItem {
  id: string;
  number: number;
  type: string;
  condition?: string | null;
  imageUrl?: string | null;
  contentOrder?: TaskContentOrder | null;
  answer?: string | null;
  answerImageUrl?: string | null;
  solution?: string | null;
  solutionImageUrl?: string | null;
  createdAt?: string;
}

export interface AdminTaskListResponse {
  items: AdminTaskListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const createTask = (payload: {
  number: number;
  type: string;
  condition: string | null;
  contentOrder: TaskContentOrder;
  answer: string | null;
  solution: string | null;
  taskImage?: File | null;
  answerImage?: File | null;
  solutionImage?: File | null;
}) => {
  const formData = new FormData();

  formData.append("number", String(payload.number));
  formData.append("type", payload.type);
  formData.append("contentOrder", payload.contentOrder);

  if (payload.condition) formData.append("condition", payload.condition);
  if (payload.answer) formData.append("answer", payload.answer);
  if (payload.solution) formData.append("solution", payload.solution);
  if (payload.taskImage) formData.append("taskImage", payload.taskImage);
  if (payload.answerImage) formData.append("answerImage", payload.answerImage);
  if (payload.solutionImage) formData.append("solutionImage", payload.solutionImage);

  return api.post("/admin/tasks", formData);
};

export const listTasks = (params: {
  number?: number;
  type?: string;
  page?: number;
  pageSize?: number;
}) => api.get<AdminTaskListResponse>("/admin/tasks", { params });
