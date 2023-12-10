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

  register(data: RegisterData) {
    return this.http.post('/api/register', {
      first_name: data.firstName,
      last_name: data.lastName,
      codewars_username: data.codewarsUsername,
      telescope_link: data.telescopeLink,
    });
  }
}
