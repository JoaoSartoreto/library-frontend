import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  baseAPI: string = '/users';

  constructor(private readonly http: HttpClient) {}

  update(user: User): Observable<User> {
    const {
      access_token,
      id,
      borrowings,
      reserves,
      deleteDate,
      passwordUpdateDate,
      ...userSend
    } = user;
    return this.http.patch<User>(
      environment.baseUrl + this.baseAPI + `/${id}`,
      userSend
    );
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(
      environment.baseUrl + this.baseAPI + `/${id}`
    );
  }
}
