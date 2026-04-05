import { api } from "./client";
import type {
  DiagnosticStartResponse,
  DiagnosticSubmitPayload,
  DiagnosticSubmitResponse,
} from "../types/Task";

export const startDiagnostic = (number: number) =>
  api.get<DiagnosticStartResponse>(`/diagnostic/${number}/start`);

export const submitDiagnostic = (data: DiagnosticSubmitPayload) =>
  api.post<DiagnosticSubmitResponse>(`/diagnostic/submit`, data);
