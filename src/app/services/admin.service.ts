import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Run, Runs} from "../models/run.model";
import {Task, Tasks} from "../models/task.model";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly TOKEN = 'challenge-token';
  private readonly LOGIN = '/api/login';
  private readonly RUNS = '/api/runs';
  private readonly TASKS = '/api/tasks';

  constructor(private http: HttpClient) {
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN, token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.LOGIN, {username, password});
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
  }

  getRunList(): Observable<Run[]> {
    return this.http.get<Runs>(this.RUNS).pipe(map(runs => runs.runs.map((run, i) => {
      return {
        id: run.id,
        startDate: run.run_start_date,
        endDate: run.run_end_date,
        description: `Run ${i + 1}`,
        index: i
      };
    })));
  }

  createRun(fromDate: string, toDate: string) {
    return this.http.post(this.RUNS, {
      runStartDate: fromDate,
      runEndDate: toDate
    });
  }

  editRun(id: number, toDate: string) {
    return this.http.put(`${this.RUNS}/${id}`, {
      newRunEndDate: toDate
    });
  }

  deleteRun(id: number) {
    return this.http.delete(`${this.RUNS}/${id}`);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Tasks>(this.TASKS).pipe(map(tasks => tasks.tasks));
  }

  createTask(id: string, runId: number, points: number) {
    return this.http.post(this.TASKS, {id, runId, points});
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.TASKS}/${id}`);
  }
}
