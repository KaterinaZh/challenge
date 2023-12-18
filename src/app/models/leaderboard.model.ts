import {Task} from "./task.model";

/**
 * response from BE
 */
export interface LeaderboardBE {
  leaderboard: Leaderboard;
}

export interface Leaderboard {
  leaderboardUpdatedDate: Date;
  fastestSolutionBonus: number;
  users: User[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  photo: string;
  telescopeLink: string;
  codewarsUsername: string;
  solutions: Solutions;
  tasks?: Task[]; // set on FE based on solutions.tasks
  place?: number; // set on FE after sorting by points
}

export interface Solutions {
  points: number;
  prevPoints: number;
  tasks: Object;
}
