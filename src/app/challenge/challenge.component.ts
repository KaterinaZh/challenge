import {Component, Input, OnInit} from '@angular/core';
import {LeaderboardService} from "../services/leaderboard.service";
import {Task} from "../models/task.model";
import {Router} from "@angular/router";
import {Run} from "../models/run.model";
import {Observable, map, noop, timer} from "rxjs";
import {UserService} from '../services/user.service';
import {Leaderboard} from "../models/leaderboard.model";

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {
  public isLoading: boolean;
  public runs: Run[] = [];
  public currentRun: Run;
  public usersCount: number = 0;
  public sliceEnd: number = 10;
  public hasTopPanel: boolean = false;
  public leaderboard: Leaderboard;
  public futureRunStart: number;
  public noCurrentRun: boolean;
  public remainingTime: Observable<number>;

  constructor(
    private leaderboardService: LeaderboardService,
    private router: Router,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.hasTopPanel = !this.userService.isRegistered();
    this.initRunList();
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
    this.loadLeaderboard(run.id, run.tasks || []);
  }

  public showAll() {
    this.sliceEnd = this.usersCount;
  }

  private loadLeaderboard(runId: number, tasks: Task[]) {
    try {
      this.leaderboardService.getLeaderboard(runId, tasks).subscribe(res => {
        this.leaderboard = res;
        this.usersCount = res.users.length;
        this.isLoading = false;
      });
    } catch (err) {
      console.log(err);
      this.isLoading = false;
    }
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
        this.loadLeaderboard(this.currentRun.id, this.currentRun.tasks || []);
      }
    }, (error) => {
      this.isLoading = false;
      this.futureRunStart = error.error.closestRunStartDate;
      this.noCurrentRun = true;

      this.remainingTime = timer(0, 1000).pipe(map(() => {
        return new Date(this.futureRunStart).getTime() - new Date().getTime();
      }));
    });
  }
}
