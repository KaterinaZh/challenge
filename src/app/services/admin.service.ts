import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly TOKEN = 'token';

  constructor(private http: HttpClient) {
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN, token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`/api/login`, {username, password});
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
  }
}
