import axios from "axios";

export const startDiagnostic = (number: number) =>
  axios.get(`/api/diagnostic/${number}/start`);

export const submitDiagnostic = (data: any) =>
  axios.post(`/api/diagnostic/submit`, data);
