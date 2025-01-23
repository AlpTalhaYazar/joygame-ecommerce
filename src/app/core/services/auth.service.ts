import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {
  BehaviorSubject,
  throwError,
  interval,
  takeWhile,
  Observable,
} from 'rxjs';

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

  login(credentials: LoginRequest): Observable<ApiResult<AuthResponseDto>> {
    return this.http.post<ApiResult<AuthResponseDto>>(
      `${environment.apiUrl}/api/auth/login`,
      credentials
    );
  }

  setLoginData(response: AuthResponseDto) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
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

  async saveUsername(username: string): Promise<void> {
    document.cookie = `username=${username}; path=/`;
  }

  async getUsername(): Promise<string | null> {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'username') {
        return value;
      }
    }
    return null;
  }

  async clearUsername(): Promise<void> {
    document.cookie =
      'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
