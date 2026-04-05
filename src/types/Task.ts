export type TaskType =
  | "trigonometric"
  | "logarithmic"
  | "exponential"
  | "rational";

export type TaskContentOrder = "image-first" | "text-first";

export interface Task {
  id: string;
  number: number;
  type: TaskType;
  part: 1 | 2;
  condition?: string;
  imageUrl?: string;
  contentOrder?: TaskContentOrder;
  answer?: string;
  solution?: string;
}

export interface DiagnosticTask extends Task {
  attempt?: {
    answer: string | null;
    isCorrect?: boolean;
  };
}

export interface DiagnosticStartResponse {
  taskNumber: number;
  title: string;
  tasks: DiagnosticTask[];
}

export interface PartTwoReview {
  taskId: string;
  selfScore: 0 | 1;
  comment?: string;
}

export interface DiagnosticSubmitPayload {
  taskNumber: number;
  answers: Array<{
    taskId: string;
    answer: string | null;
  }>;
  partTwoReviews?: PartTwoReview[];
}

export interface DiagnosticSubmitResponse {
  summary: Record<TaskType, number>;
  maxByType: number;
  weakTypes: TaskType[];
  partOne: {
    scored: number;
    total: number;
  };
  partTwo: Array<{
    taskId: string;
    condition: string;
    solution: string;
    selfScore?: 0 | 1;
  }>;
}
