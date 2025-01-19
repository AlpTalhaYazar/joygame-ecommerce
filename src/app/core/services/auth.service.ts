import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { ApiResult } from '../models/apiResult';
import { environment } from '../../../environments/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginResponse, LoginResponseUser } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoginResponseUser | null>(
    null
  );
  private jwtHelper = new JwtHelperService();

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      this.currentUserSubject.next(userData);
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<ApiResult<LoginResponse>>(`${environment.apiUrl}/api/auth/login`, {
        username,
        password,
      })
      .pipe(
        map((response) => {
          if (response.isSuccess && response.data) {
            // Store token
            localStorage.setItem('token', response.data.token);
            // Store user data
            localStorage.setItem(
              'currentUser',
              JSON.stringify(response.data.user)
            );
            this.currentUserSubject.next(response.data.user);
          }
          return response;
        }),
        catchError((error) => {
          const errorMessage =
            error.error?.error?.message || 'An unknown error occurred';
          this.notification.error('Login failed', errorMessage);

          return throwError(() => error);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  hasPermission(permission: string): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.permission.includes(permission);
    } catch {
      return false;
    }
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
}
