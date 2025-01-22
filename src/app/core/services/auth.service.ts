import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError, interval, takeWhile } from 'rxjs';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { ApiResult } from '../models/apiResult';
import { environment } from '../../../environments/environment';
import {
  AuthUserDto,
  LoginRequest,
  AuthResponseDto,
  ResetPasswordRequest,
  ForgotPasswordResponse,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUserDto | null>(null);
  private jwtHelper = new JwtHelperService();

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      this.currentUserSubject.next(userData);
    }
  }

  login(credentials: LoginRequest) {
    return this.http
      .post<ApiResult<AuthResponseDto>>(
        `${environment.apiUrl}/api/auth/login`,
        credentials
      )
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            const { token: Token, user: User } = response.data;

            // Store token
            localStorage.setItem('token', Token);

            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(User));
            this.currentUserSubject.next(User);

            this.successfullLoginNotification(response);
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

  isUserLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): AuthUserDto | null {
    return this.currentUserSubject.value;
  }

  successfullLoginNotification(response: ApiResult<AuthResponseDto>) {
    const initialCount = 3;
    const countdown$ = interval(1000).pipe(
      takeWhile((val) => initialCount - val >= 0)
    );

    const subscription = countdown$.subscribe({
      next: (val) => {
        const remainingSeconds = initialCount - val;

        this.notification.success(
          'Login successful',
          `Welcome back! ${response?.data?.user.firstName} ${response?.data?.user.lastName}, 
           You will be redirecting to categories page in ${remainingSeconds}`,
          { nzKey: 'login-success' }
        );

        if (remainingSeconds === 0) {
          this.router.navigate(['app/categories']);
          subscription.unsubscribe();
        }
      },
      error: (error) => {
        console.error(error);
        subscription.unsubscribe();
      },
    });
  }

  forgotPassword(email: string) {
    return this.http.post<ApiResult<ForgotPasswordResponse>>(
      `${environment.apiUrl}/api/auth/forgot-password`,
      { email }
    );
  }

  resetPassword(request: ResetPasswordRequest) {
    return this.http.post<ApiResult<boolean>>(
      `${environment.apiUrl}/api/auth/reset-password`,
      request
    );
  }
}
