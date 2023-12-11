import {Task} from "./task.model";

/**
 * response from BE
 */
export interface Runs {
  runs: RunBE[];
}

/**
 * run model from BE
 */
export interface RunBE {
  id: number;
  run_start_date: string;
  run_end_date: string;
  description?: string;
}

/**
 * run model used on UI
 */
export interface Run {
  id: number;
  description: string;
  index: number;
  startDate: string;
  endDate: string;
  tasks?: Task[];
}
