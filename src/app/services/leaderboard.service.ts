import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Task} from "../models/task.model";
import {Run, Runs} from "../models/run.model";
import {Leaderboard, LeaderboardBE, User} from "../models/leaderboard.model";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  // For test data:
  // private dataURL = '../../assets/data';
  // private readonly RUNS = `${this.dataURL}/runs.json`;
  // private readonly LEADERBOARD = `${this.dataURL}/leaderboard.json`;
  private readonly RUNS = '/api/runs';
  private readonly LEADERBOARD = '/leaderboard';
  private readonly weekNames: { name: string, links: string[] }[] =
    [
      {
        name: 'Algorithms', links: [
          'https://www.geeksforgeeks.org/learn-algorithms-with-javascript-tutorial/',
          'https://www.freecodecamp.org/news/introduction-to-algorithms-with-javascript-examples/',
          'https://www.toptal.com/developers/sorting-algorithms',
          'https://www.bigocheatsheet.com/',
          'https://mrohitsingh.medium.com/top-10-javascript-algorithms-for-coding-challenges-8cbf258841a1'
        ]
      },
      {
        name: 'Puzzles', links: [

        ]},
      {
        name: 'Mathematics', links: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math',
          'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Math',
          'https://www.geeksforgeeks.org/ackermann-function/',
          'https://web.archive.org/web/20220614001843/https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book-Z-H-11.html#%_sec_1.2.4'
        ]
      },
      {
        name: 'Fundamentals',
        links: ['https://javascript.info/first-steps',
          'https://javascript.info/data-types',
          'https://developer.mozilla.org/en-US/curriculum/core/javascript-fundamentals/',
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures',
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'
        ]
      },
      {
        name: 'Design patterns & Framework specific', links: [
          'https://www.patterns.dev/',
          'https://www.freecodecamp.org/news/javascript-design-patterns-explained/',
          'https://dev.to/topefasasi/js-design-patterns-a-comprehensive-guide-h3m',
          'https://www.toptal.com/javascript/comprehensive-guide-javascript-design-patterns',
          'https://www.geeksforgeeks.org/javascript-design-patterns/',
          'https://dev.to/walosha/dependency-injection-pattern-for-beginners-3nc4',
          'https://angular.dev/',
          'https://www.freecodecamp.org/news/how-to-handle-events-in-react-19/',
          'https://react.dev/'
      ]},
      {
        name: 'Regular Expressions', links: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
          'https://www.w3schools.com/jsref/jsref_obj_regexp.asp',
          'https://regex101.com/'
        ]
      },
      {
        name: 'Security & Cryptography', links: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt',
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode',
          'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math'
        ]
      },
      {name: 'Performance', links: [
        'https://developer.mozilla.org/en-US/docs/Learn/Performance/JavaScript',
        'https://en.wikipedia.org/wiki/Algorithmic_efficiency',
        'https://medium.com/quick-code/considering-optimization-and-time-complexity-with-js-algorithms-4c8915086518',
        'https://medium.com/@feelwjd/7-algorithms-in-javascript-1274dec046d1'
      ]},
      {name: '', links: []},
      {name: '', links: []}];


  constructor(private http: HttpClient) {
  }

  getRunList(): Observable<Run[]> {
    return this.http.get<Runs>(this.RUNS).pipe(map(runs => runs.runs.sort((run1, run2) => {
      return new Date(run1.run_end_date).getTime() - new Date(run2.run_end_date).getTime()
    }).map((run, i) => {
      return {
        id: run.id,
        startDate: run.run_start_date,
        endDate: run.run_end_date,
        tasks: run.tasks.sort((task1: Task, task2: Task) => {
          return task1.points - task2.points
        }),
        description: `Week ${i + 1} ${this.weekNames[i]?.name ? '- ' + this.weekNames[i].name : ''}`,
        index: i,
        links: this.weekNames[i] ? this.weekNames[i].links : []
      };
    })));
  }

  getLeaderboard(runId: number): Observable<Leaderboard> {
    // return this.http.get<LeaderboardBE>(`${this.LEADERBOARD}`).pipe(
    //   map(res => res.leaderboard));
    return this.http.get<LeaderboardBE>(`${this.RUNS}/${runId}${this.LEADERBOARD}`).pipe(
      map(res => res.leaderboard));
  }

  getLeaderboardFull(tasks: Task[], l: Leaderboard): Leaderboard {
    const leaderboard: Leaderboard = JSON.parse(JSON.stringify(l));
    leaderboard.users = leaderboard.users.map(user => {
      user.tasks = tasks.map(task => {
        const solvedTask = (user.solutions.tasks as any)[task.id];
        return solvedTask ? solvedTask : {}
      });
      user.place = 1;
      return user;
    }).sort((user1: User, user2: User) => {
      return user2.solutions.points - user1.solutions.points;
    });
    if (leaderboard.users.length > 0) {
      this.setPlacesForUsers(leaderboard.users);
    }
    return leaderboard;
  }

  getLeaderboardOfWeek(tasks: Task[], l: Leaderboard): Leaderboard {
    const leaderboard: Leaderboard = JSON.parse(JSON.stringify(l));
    leaderboard.users = leaderboard.users.map(user => {
      user.tasks = tasks.map(task => {
        const solvedTask = (user.solutions.tasks as any)[task.id];
        return solvedTask ? solvedTask : {}
      });
      user.place = 1;
      user.solutions.points = user.solutions.points - user.solutions.prevPoints;
      user.solutions.prevPoints = 0;
      return user;
    }).sort((user1: User, user2: User) => {
      return user2.solutions.points - user1.solutions.points;
    });
    if (leaderboard.users.length > 0) {
      this.setPlacesForUsers(leaderboard.users);
    }
    leaderboard.users = leaderboard.users.filter(u => {
      if (u.solutions.points > 0) {
        return u;
      }
      return;
    });
    // leaderboard.users.forEach(u => console.log(u.firstName + ' ' + u.lastName))
    return leaderboard;
  }

  private setPlacesForUsers(users: User[]) {
    users.reduce((user1: User, user2: User) => {
      if (user1.solutions.points === user2.solutions.points) {
        user2.place = user1.place;
      } else {
        user2.place = user1.place ? user1.place + 1 : 1;
      }
      return user2;
    });
  }
}
