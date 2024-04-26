import {Component, OnInit} from '@angular/core';
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
  public hasTopPanel: boolean = false;
  public leaderboard: Leaderboard;
  public leaderboardOfWeek: Leaderboard;
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
    // TODO: remove addTimer() and return initRunList()
    // this.initRunList();
    this.addTimer();
  }

  public goToRegister() {
    this.router.navigate(['/register']);
  }

  public toInfo(id: number) {
    this.router.navigate(['/info/'+ id]);
  }

  public scroll(id: string) {
    const el = document.getElementById(id);
    el ? el.scrollIntoView({behavior: 'smooth'}) : noop();
  }

  public chooseRun(run: Run) {
    this.currentRun = run;
    this.loadLeaderboard(run.id, run.tasks || []);
  }

  private addTimer() {
    this.futureRunStart = Date.parse('2024-04-28T00:00:00.000Z');
    this.noCurrentRun = true;
    this.remainingTime = timer(0, 1000).pipe(map(() => {
      return new Date(this.futureRunStart).getTime() - new Date().getTime();
    }));
  }

  private loadLeaderboard(runId: number, tasks: Task[]) {
    try {
      this.leaderboardService.getLeaderboard(runId).subscribe(res => {
        this.leaderboard = this.leaderboardService.getLeaderboardFull(tasks, res);
        this.leaderboardOfWeek = this.leaderboardService.getLeaderboardOfWeek(tasks, res);
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
