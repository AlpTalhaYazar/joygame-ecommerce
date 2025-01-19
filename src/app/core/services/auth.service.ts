import { ApiResult } from '../models/apiResult';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginResponse, LoginResponseUser } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoginResponseUser | null>(null);
  private jwtHelper = new JwtHelperService();

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      this.currentUserSubject.next(userData);
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<ApiResult<LoginResponse>>(`${environment.apiUrl}/api/auth/login`, { username, password })
      .pipe(
        map((response) => {
          if (response.isSuccess && response.data) {
            // Store token
            localStorage.setItem('token', response.data.token);
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
          return response;
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
