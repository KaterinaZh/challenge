import {Component, OnInit} from '@angular/core';
import {LeaderboardService} from "../services/leaderboard.service";
import {Task} from "../models/task.model";
import {Router} from "@angular/router";
import {Run} from "../models/run.model";
import {Observable, interval, map, noop, shareReplay} from "rxjs";
import {UserService} from '../services/user.service';
import {Leaderboard} from "../models/leaderboard.model";

interface TimeComponents {
  secondsToDday: number;
  minutesToDday: number;
  hoursToDday: number;
  daysToDday: number;
}

function calcDateDiff(endDay: Date = new Date(2022, 0, 1)): TimeComponents {
  const dDay = endDay.valueOf();

  const milliSecondsInASecond = 1000;
  const hoursInADay = 24;
  const minutesInAnHour = 60;
  const secondsInAMinute = 60;

  const timeDifference = dDay - Date.now();

  const daysToDday = Math.floor(
    timeDifference /
      (milliSecondsInASecond * minutesInAnHour * secondsInAMinute * hoursInADay)
  );

  const hoursToDday = Math.floor(
    (timeDifference /
      (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
      hoursInADay
  );

  const minutesToDday = Math.floor(
    (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
      secondsInAMinute
  );

  const secondsToDday =
    Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;

  return { secondsToDday, minutesToDday, hoursToDday, daysToDday };
}

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
  public futureRunStart: Date;
  public noCurrentRun: boolean;
  public remainingTime: Observable<TimeComponents>;

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

  public toInfo(id: number) {
    this.router.navigate(['/info/'+ id]);
  }

  public scroll(id: string) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.getElementById('timer-panel');
    }
    el ? el.scrollIntoView({behavior: 'smooth'}) : noop();
  }

  public chooseRun(run: Run) {
    this.currentRun = run;
    this.loadLeaderboard(run.id, run.tasks || []);
  }

  public isTopOfPage() {
    return window.scrollY == 0;
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
      this.futureRunStart = new Date(error.error.closestRunStartDate);
      this.noCurrentRun = true;

      this.remainingTime = interval(1000).pipe(
        map(() => calcDateDiff(this.futureRunStart)),
        shareReplay(1)
      );
    });
  }
}
