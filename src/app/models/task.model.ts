/**
 * response from BE
 */
export interface Tasks {
  tasks: Task[];
}

export interface Task {
  id: string;
  name: string;
  completedAt?: string;
  completedLanguages?: string[];
  points: number;
  fastestSolution?: boolean;
}

export interface TaskList {
  totalPages: number;
  totalItems: number;
  data: Task[];
}
