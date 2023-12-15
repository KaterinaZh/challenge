import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Task, TaskList} from "../models/task.model";
import {User} from "../models/user.model";
import {Run, Runs} from "../models/run.model";
import {LeaderboardBE} from "../models/leaderboard.model";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private readonly RUNS = '/api/runs';
  private readonly LEADERBOARD = '/leaderboard';
  private apiURL = 'https://www.codewars.com/api/v1';
  private dataURL = '../../assets/data';

  constructor(private http: HttpClient) {
  }

  getUserTasksData(userName: string, pageNumber: number): Observable<TaskList> {
    return this.http.get<TaskList>(`${this.apiURL}/users/${userName}/code-challenges/completed?page=${pageNumber}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.dataURL}/users.json`);
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

  getTasksInfoByUserData(taskList: TaskList, tasks: Task[]): Task[] {
    return tasks.map(task => {
      const userTask: Task = {...task};
      const foundTasks: Task[] = taskList.data.filter(userTask => task.id === userTask.id &&
        (userTask.completedLanguages?.includes('javascript') ||
          userTask.completedLanguages?.includes('typescript')));
      if (foundTasks?.length > 0) {
        userTask.completedAt = foundTasks[0].completedAt;
      } else {
        userTask.points = 0;
      }
      return userTask;
    });
  }

  getLeaderboard(runId: number): Observable<LeaderboardBE> {
    return this.http.get<LeaderboardBE>(`${this.RUNS}/${runId}${this.LEADERBOARD}`);
  }
}
