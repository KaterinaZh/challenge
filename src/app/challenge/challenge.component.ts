import {Component, OnInit} from '@angular/core';
import {LeaderboardService} from "../services/leaderboard.service";
import {Task, TaskList} from "../models/task.model";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {Run} from "../models/run.model";
import {noop} from "rxjs";
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {
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
  public hasTopPanel: boolean = false;

  constructor(
    private leaderboardService: LeaderboardService,
    private router: Router,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.hasTopPanel = !this.userService.isRegistered();
    this.initRunList();
    this.leaderboardService.getUsers().subscribe((res: User[]) => this.allUsers = res);
  }

  public goToRegister() {
    this.router.navigate(['/register']);
  }

  public scroll(id: string) {
    const el = document.getElementById(id);
    el ? el.scrollIntoView({behavior: 'smooth'}) : noop();
  }

  public chooseRun(run: Run) {
    this.currentRun = run;
    this.loadLeaderboard(run.id);
    this.loadUsers();
  }

  public showAll() {
    this.sliceEnd = this.usersCount;
  }

  private loadLeaderboard(runId: number) {
    this.leaderboardService.getLeaderboard(runId).subscribe(res => {
      console.log(res);
    });
  }

  private loadUsers() {
    this.isLoading = true;
    this.users = [];
    const names: string[] = this.userNames.split(';').filter(name => name !== '');
    this.usersCount = names.length;
    names.forEach(nickname => {
      this.getUserTasksData(nickname, 0);
    });
  }

  private initRunList() {
    this.isLoading = true;
    this.leaderboardService.getRunList().subscribe((runs: Run[]) => {
      this.runs = runs;
      if (this.runs.length > 0) {
        const today = new Date();
        const todayRun = this.runs.filter(run => {
          if (today >= new Date(run.startDate) && today <= new Date(run.endDate)) {
            return run;
          }
          return;
        })
        this.currentRun = todayRun.length > 0 ? todayRun[0] : this.runs[this.runs.length - 1];
        this.loadLeaderboard(this.currentRun.id);
      }
      this.loadUsers(); // TODO: remove when leaderboard is ready
      this.isLoading = false;
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
    const tasks = this.leaderboardService.getTasksInfoByUserData(taskList, this.currentRun.tasks || []);
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
    for (const task of this.currentRun.tasks || []) {
      let earliest: Date | null | undefined = null;
      let currentUser: User | null | undefined = null;
      for (const user of this.users) {
        let completedAt = user.tasks.filter(t => t.id === task.id).map(t => t.completedAt)[0];
        if (completedAt) {
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
