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
  solutions: Solution[];
}

export interface Solution {
  points: number;
  prevPoints: number;
  tasks: Object;
}
