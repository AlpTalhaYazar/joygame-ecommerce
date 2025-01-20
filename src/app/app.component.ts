import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subscription } from 'rxjs';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';

import { AuthService } from './core/services/auth.service';

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
export class AppComponent implements OnInit {
  isCollapsed = false;
  isLoggedIn: boolean = false;
  firstName: string = '';
  lastName: string = '';

  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isLoggedIn = this.authService.isUserLoggedIn();

    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
      }
    });
  }

  async ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
