import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
} from 'ng-zorro-antd/form';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzCardComponent,
    NzFormDirective,
    FormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputDirective,
    NzButtonComponent,
    RouterLink,
    NzCheckboxComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = { username: '', password: '' };
  rememberMe: boolean = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const rememberedUsername = await this.authService.getUsername();
    if (rememberedUsername) {
      this.credentials.username = rememberedUsername;
      this.rememberMe = true;
    }
  }

  async onSubmit(): Promise<void> {
    this.isLoading = true;

    try {
      var loginResponse = await this.authService
        .login(this.credentials)
        .toPromise();

      if (loginResponse?.success && loginResponse.data) {
        this.authService.setLoginData(loginResponse.data);

        if (this.rememberMe) {
          this.authService.saveUsername(this.credentials.username);
          console.log('Username saved');
        } else {
          this.authService.clearUsername();
        }

        this.notification.success('Login successful', 'Welcome back!');
        this.router.navigate(['/']);
      } else {
        this.notification.error(
          'Login failed',
          loginResponse?.error?.message || 'An error occurred'
        );
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.notification.error(
        'Login failed',
        error?.error?.error?.message || 'An error occurred'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
