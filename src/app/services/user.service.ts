import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

type RegisterData = {
  firstName: string;
  lastName: string;
  telescopeLink: string;
  codewarsUsername: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly HAS_REGISTERED = 'hasRegistered';
  private readonly THEME = 'challenge-user-theme';
  private readonly REGISTER = '/api/register';

  constructor(private http: HttpClient) {
  }

  isRegistered() {
    return !!localStorage.getItem(this.HAS_REGISTERED);
  }

  setRegistered() {
    localStorage.setItem(this.HAS_REGISTERED, String(true));
  }

  getTheme(): string | null {
    return localStorage.getItem(this.THEME);
  }

  setTheme(isLight: boolean) {
    localStorage.setItem(this.THEME, isLight ? 'light': 'dark');
  }

  register(data: RegisterData) {
    return this.http.post(this.REGISTER, data);
  }
}
