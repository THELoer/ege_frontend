// src/types/Task.ts
export interface Task {
  id: string;
  number: number;
  type: "trigonometric" | "logarithmic" | "exponential" | "rational";
  part: 1 | 2;
  condition: string;
  answer: string;
  solution: string;
}
