import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { lastValueFrom, BehaviorSubject } from 'rxjs';

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

  private authBaseUrl = `${environment.apiUrl}/api/auth`;
  private loginUrl = `${this.authBaseUrl}/login`;
  private forgotPasswordUrl = `${this.authBaseUrl}/forgot-password`;
  private resetPasswordUrl = `${this.authBaseUrl}/reset-password`;

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

  async login(credentials: LoginRequest): Promise<ApiResult<AuthResponseDto>> {
    var response = this.http.post<ApiResult<AuthResponseDto>>(
      this.loginUrl,
      credentials
    );

    return await lastValueFrom(response);
  }

  async forgotPassword(
    email: string
  ): Promise<ApiResult<ForgotPasswordResponse>> {
    var response = this.http.post<ApiResult<ForgotPasswordResponse>>(
      this.forgotPasswordUrl,
      { email }
    );

    return await lastValueFrom(response);
  }

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ApiResult<boolean>> {
    var response = this.http.post<ApiResult<boolean>>(
      this.resetPasswordUrl,
      request
    );

    return await lastValueFrom(response);
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

    this.router.navigate(['/login']);
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
