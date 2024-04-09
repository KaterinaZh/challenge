import {Component, Input, OnInit} from '@angular/core';
import {Run} from "../../models/run.model";
import {Leaderboard} from "../../models/leaderboard.model";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() currentRun: Run;
  @Input() leaderboard: Leaderboard;
  @Input() isWeekBoard: boolean;
  public usersCount: number = 0;
  public sliceEnd: number = 10;
  public header = 'Leaderboard';

  ngOnInit(): void {
    this.usersCount = this.leaderboard.users.length;
    if (this.isWeekBoard) {
      this.header = 'Leaders of the week';
    }
  }

  public showAll() {
    this.sliceEnd = this.usersCount;
  }
}
