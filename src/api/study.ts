import { api } from "./client";
import type { TaskContentOrder } from "../types/Task";

export interface StudyMaterial {
  id: string;
  number: number;
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
}

export interface CheatSheet {
  id: string;
  number: number;
  title: string;
  content?: string;
  imageUrl?: string;
}

export interface CatalogTaskItem {
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

export interface CatalogTaskResponse {
  items: CatalogTaskItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const getTrainingMaterials = (number: number) =>
  api.get<StudyMaterial[]>(`/tasks/${number}/materials`);

export const listCheatSheets = (number: number) =>
  api.get<CheatSheet[]>(`/tasks/${number}/cheatsheets`);

export const createCheatSheet = (payload: {
  number: number;
  title: string;
  content: string | null;
  image?: File | null;
}) => {
  const formData = new FormData();
  formData.append("number", String(payload.number));
  formData.append("title", payload.title);
  if (payload.content) formData.append("content", payload.content);
  if (payload.image) formData.append("image", payload.image);

  return api.post("/admin/cheatsheets", formData);
};

export const listTaskCatalog = (params: {
  number?: number;
  type?: string;
  page?: number;
  pageSize?: number;
}) => api.get<CatalogTaskResponse>("/tasks/catalog", { params });
