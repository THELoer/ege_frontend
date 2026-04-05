import { api } from "./client";

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
