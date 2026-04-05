import { api } from "./client";

export interface TaskStat {
  taskNumber: number;
  correct: number;
  incorrect: number;
}

export interface StudentStatsResponse {
  tasks: TaskStat[];
}

export const getMyStats = () => api.get<StudentStatsResponse>("/stats/me");
