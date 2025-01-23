import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
} from 'ng-zorro-antd/form';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    try {
      var forgotPasswordResponse = await this.authService.forgotPassword(
        this.email
      );

      if (forgotPasswordResponse?.success) {
        this.notification.success(
          'Success',
          'Password reset instructions sent to your email'
        );
        this.router.navigate(['/reset-password'], {
          state: {
            email: this.email,
            resetToken: forgotPasswordResponse.data?.resetToken,
          },
        });
      }
    } catch (error: any) {
      this.notification.error(
        'Error',
        error?.error?.message || 'Failed to send reset instructions'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
