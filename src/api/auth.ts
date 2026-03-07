import axios from "axios";

export const login = (email: string, password: string) =>
  axios.post("/api/auth/login", { email, password });
