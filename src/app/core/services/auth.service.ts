import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError, interval, takeWhile } from 'rxjs';
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
    private notification: NzNotificationService,
    private router: Router
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

  getCurrentUser(): LoginResponseUser | null {
    return this.currentUserSubject.value;
  }

  successfullLoginNotification(response: ApiResult<LoginResponse>) {
    const initialCount = 3;
    const countdown$ = interval(1000).pipe(
      takeWhile((val) => initialCount - val >= 0)
    );

    const subscription = countdown$.subscribe({
      next: (val) => {
        const remainingSeconds = initialCount - val;

        this.notification.success(
          'Login successful',
          `Welcome back! ${response.data.user.firstName} ${response.data.user.lastName}, 
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
}
