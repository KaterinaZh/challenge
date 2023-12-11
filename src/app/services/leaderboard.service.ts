import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Task, TaskList} from "../models/task.model";
import {User} from "../models/user.model";
import {Run} from "../models/run.model";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

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

  getTasks(): Observable<Run[]> {
    return this.http.get<Run[]>(`${this.dataURL}/tasks.json`);
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
}
