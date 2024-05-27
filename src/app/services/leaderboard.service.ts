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

  private readonly RUNS = '/api/runs';
  private readonly LEADERBOARD = '/leaderboard';
  private readonly weekNames: { name: string, links: string[] }[] =
    [
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
        name: 'OOP', links: [
          'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming',
          'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript',
          'https://www.freecodecamp.org/news/object-oriented-programming-javascript/',
          'https://javascript.info/classes',
          'https://www.geeksforgeeks.org/introduction-object-oriented-programming-javascript/'
        ]
      },
      {name: 'Functional Programming', links: [
        'https://dev.to/jamesrweb/principles-of-functional-programming-4b7c',
        'https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function',
        'https://dev.to/biomathcode/composition-of-functions-178g',
        'https://dev.to/sundarbadagala081/javascript-chaining-3h6g',
        'https://javascript.info/currying-partials',
        'https://javascript.info/generators'
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
      {name: 'Performance', links: []},
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
