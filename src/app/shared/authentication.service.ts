import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseApi: string = '/auth';
  public currentUser: Observable<User | null>;
  private currentUserSubject: BehaviorSubject<User | null>;
  private propertyName: string = 'currentUser';
  private tokenExpiryTime: number = 3600;

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserStorage(false)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  isLoggedIn(): boolean {
    const user = this.getUserStorage(false);
    return !!(user && user.access_token !== null);
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.storageService.remove(this.propertyName);
    this.currentUserSubject.next(null);
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http
      .post<User>(environment.baseUrl + this.baseApi + '/login', {
        email,
        password,
      })
      .pipe(
        map((user) => {
          if (user?.access_token) {
            this.storageService.set(
              this.propertyName,
              user,
              this.tokenExpiryTime
            );
            this.currentUserSubject.next(user);
            return user;
          } else {
            return null;
          }
        })
      );
  }

  validateTokenExpirationTime(): void {
    if (this.storageService.isExpired(this.propertyName)) {
      this.logout();
    }
  }

  private getUserStorage(isRediret: boolean = true) {
    let user: User | null = null;
    try {
      user = this.storageService.get(this.propertyName);
    } catch (error) {
      this.logout();
      if (isRediret) {
        this.router.navigate(['/login']);
      }
    }
    return user;
  }
}
