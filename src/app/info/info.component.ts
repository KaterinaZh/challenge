import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Run} from "../models/run.model";
import {LeaderboardService} from "../services/leaderboard.service";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  public isLoading: boolean;
  public currentRun: Run;

  constructor(
    private leaderboardService: LeaderboardService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    const runId = this.route.snapshot.params['run'];
    this.leaderboardService.getRunList().subscribe((runs: Run[]) => {
      const run = runs.find(run => +run.id === +runId);
      this.isLoading = false;
      if (run) {
        this.currentRun = run;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  redirectToHomePage() {
    this.router.navigate(['/']);
  }
}
