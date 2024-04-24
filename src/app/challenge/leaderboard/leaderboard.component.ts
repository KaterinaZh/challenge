import {Component, Input} from '@angular/core';
import {Run} from "../../models/run.model";
import {Leaderboard} from "../../models/leaderboard.model";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  @Input() isLoading: boolean;
  @Input() currentRun: Run;
  @Input() leaderboard: Leaderboard;
  @Input() isWeekBoard: boolean;
  public sliceEnd: number = 10;

  public showAll() {
    this.sliceEnd = this.leaderboard.users.length;
  }
}
