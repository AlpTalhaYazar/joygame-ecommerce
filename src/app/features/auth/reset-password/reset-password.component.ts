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
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  email: string = '';
  resetToken: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      email: string;
      resetToken: string;
    };
    if (state?.email && state?.resetToken) {
      this.email = state.email;
      this.resetToken = state.resetToken;
    } else {
      this.router.navigate(['/login']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.newPassword !== this.confirmPassword) {
      this.notification.error('Error', 'Passwords do not match');
      return;
    }

    this.isLoading = true;
    try {
      var resetPasswordResponse = await this.authService.resetPassword({
        email: this.email,
        resetToken: this.resetToken,
        newPassword: this.newPassword,
      });

      if (resetPasswordResponse?.success) {
        this.notification.success('Success', 'Password reset successfully');
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      this.notification.error(
        'Error',
        error?.error?.message || 'Failed to reset password'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
