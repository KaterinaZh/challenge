import {Component, OnInit} from '@angular/core';
import {LeaderboardService} from "../services/leaderboard.service";
import {Run, Task, TaskList} from "../models/task.model";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowComponent implements OnInit {
  public isLoading: boolean;
  public runs: Run[] = [];
  public currentRun: Run;
  public allUsers: User[] = [];
  public users: User[] = [];
  public userNames: string = 'dimitiros;jcdenton23;ilyasyzv;grayhat7;Crepiks;' +
    'temirlanamangaliyev;Ernest2077;argyyyn;VKeyPEDIdea;kate_89;Mitchel15;balu9';
  //whilestevego;Cloud Walker;dfhwze
  public usersCount: number = 0;
  public sliceEnd: number = 10;

  constructor(private leaderboardService: LeaderboardService,
              private router: Router) {
  }

  ngOnInit() {
    this.leaderboardService.getTasks().subscribe((res: Run []) => {
      if (res && res.length > 0) {
        this.runs = res;
        this.currentRun = res[res.length - 1];
        // TODO: add validation on dates: endDate and completedAt, put it as unsolved task
      }
    });
    this.leaderboardService.getUsers().subscribe((res: User[]) => this.allUsers = res);
  }

  public goToAdmin() {
    this.router.navigate(['/admin-login']);
  }

  public changeRun(run: Run) {
    this.currentRun = run;
    this.addUsers();
  }

  public showAll() {
    this.sliceEnd = this.usersCount;
  }

  public addUsers() {
    this.isLoading = true;
    this.users = [];
    const names: string[] = this.userNames.split(';').filter(name => name !== '');
    this.usersCount = names.length;
    names.forEach(nickname => {
      this.getUserTasksData(nickname, 0);
    });
  }

  private getUserTasksData(nickname: string, pageNumber: number, tasks?: Task[]) {
    this.leaderboardService.getUserTasksData(nickname, pageNumber)
      .subscribe({
        next: (res: TaskList) => {
          if (tasks) {
            res.data.push(...tasks);
          }
          if (res.totalPages > pageNumber + 1) {
            this.getUserTasksData(nickname, pageNumber + 1, res.data);
          } else {
            this.handleTaskList(nickname, res);
          }
        }, error: (err) => {
          console.error(err);
          this.handleTaskList(nickname, {data: [], totalPages: 0, totalItems: 0});
        }
      });
  }

  private handleTaskList(nickname: string, taskList: TaskList) {
    const tasks = this.leaderboardService.getTasksInfoByUserData(taskList, this.currentRun.tasks);
    const total: number = tasks.map(task => task.points ? task.points : 0)
      .reduce((partialSum, a) => partialSum + a, 0);
    const user = this.allUsers.filter(user => user.nickname === nickname);
    if (user?.length > 0) {
      const prevPoints = this.prevPoints(user[0].runsPoints);
      this.users.push({...user[0], tasks, prevPoints, total: total + prevPoints, place: 1});
    } else {
      this.users.push({name: nickname, nickname, tasks, prevPoints: 0, runsPoints: [], total, place: 1});
    }
    this.sortLeaderboard();
  }

  private prevPoints(runsPoints: number[]): number {
    let sum = 0;
    runsPoints.forEach((el: number, i: number) => {
      if (i + 1 > this.currentRun.index) {
        return;
      }
      sum += el;
    });
    return sum;
  }

  private sortLeaderboard() {
    if (this.users.length === this.usersCount) {
      this.findFastestSolution();
      this.users.sort((user1: User, user2: User) => {
        return user2.total - user1.total;
      });
      this.setPlacesForUsers();
    }
  }

  private setPlacesForUsers() {
    this.users.reduce((user1: User, user2: User) => {
      if (user1.total === user2.total) {
        user2.place = user1.place;
      } else {
        user2.place = user1.place ? user1.place + 1 : 1;
      }
      return user2;
    });
  }

  private findFastestSolution() {
    for (const task of this.currentRun.tasks) {
      let earliest: Date | null | undefined = null;
      let currentUser: User | null | undefined = null;
      for (const user of this.users) {
        let completedAt = user.tasks.filter(t => t.id === task.id).map(t => t.completedAt)[0];
        if (completedAt && (!earliest || earliest > new Date(completedAt)) &&
          new Date(completedAt) > new Date(this.currentRun.startDate)) {
          earliest = new Date(completedAt);
          currentUser = user;
        }
      }
      if (currentUser) {
        currentUser.tasks.forEach(t => {
          if (t.id === task.id) {
            t.fastestSolution = true;
            if (currentUser && currentUser.total) {
              currentUser.total = currentUser.total + 5;
            }
          }
        })
      }
    }
    this.isLoading = false;
  }
}
