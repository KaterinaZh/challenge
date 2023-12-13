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

  constructor(private http: HttpClient) {
  }

  isRegistered() {
    return !!localStorage.getItem('hasRegistered');
  }

  register(data: RegisterData) {
    return this.http.post('/api/register', data);
  }
}
