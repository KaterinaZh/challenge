import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Task} from "../models/task.model";
import {Run, Runs} from "../models/run.model";
import {Leaderboard, LeaderboardBE, User} from "../models/leaderboard.model";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private readonly RUNS = '/api/runs';
  private readonly LEADERBOARD = '/leaderboard';

  constructor(private http: HttpClient) {
  }

  getRunList(): Observable<Run[]> {
    return this.http.get<Runs>(this.RUNS).pipe(map(runs => runs.runs.map((run, i) => {
      return {
        id: run.id,
        startDate: run.run_start_date,
        endDate: run.run_end_date,
        tasks: run.tasks.sort((task1: Task, task2: Task) => {
          return task1.points - task2.points
        }),
        description: `Run ${i + 1}`,
        index: i
      };
    })));
  }

  getLeaderboard(runId: number, tasks: Task[]): Observable<Leaderboard> {
    return this.http.get<LeaderboardBE>(`${this.RUNS}/${runId}${this.LEADERBOARD}`).pipe(
      map(res => {
        res.leaderboard.users = res.leaderboard.users.map(user => {
          user.tasks = tasks.map(task => {
            const solvedTask = (user.solutions.tasks as any)[task.id];
            return solvedTask ? solvedTask : {}
          });
          user.place = 1;
          return user;
        }).sort((user1: User, user2: User) => {
          return user2.solutions.points - user1.solutions.points;
        })
        if (res.leaderboard.users.length > 0) {
          this.setPlacesForUsers(res.leaderboard.users);
        }
        return res.leaderboard;
      }));
  }

  private setPlacesForUsers(users: User[]) {
    users.reduce((user1: User, user2: User) => {
      if (user1.solutions.points === user2.solutions.points) {
        user2.place = user1.place;
      } else {
        user2.place = user1.place ? user1.place + 1 : 1;
      }
      return user2;
    });
  }
}
