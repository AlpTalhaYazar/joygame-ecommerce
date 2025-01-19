import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzAvatarComponent,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isCollapsed = false;
  isLoggedIn = true; // You'll need to manage this state based on your auth service
  userName = 'qwe qwe'; // Set this from your user service
  userPhotoUrl = ''; // Set this from your user service

  constructor(private authService: AuthService) {
  }

  login() {
  }

  logout() {
  }
}
