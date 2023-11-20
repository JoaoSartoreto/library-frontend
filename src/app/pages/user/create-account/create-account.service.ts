import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUser, User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreateAccountService {
  baseAPI: string = '/users';

  constructor(private readonly http: HttpClient) {}

  create(user: CreateUser): Observable<User> {
    return this.http.post<User>(environment.baseUrl + this.baseAPI, user);
  }
}
