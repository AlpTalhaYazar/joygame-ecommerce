import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzListComponent, NzListItemComponent } from 'ng-zorro-antd/list';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    NzDividerComponent,
    NzRowDirective,
    NzColDirective,
    NzButtonComponent,
    NzIconDirective,
    NzListItemComponent,
    NzTypographyComponent,
    NzCardComponent,
    NzListComponent,
    NgIf,
    RouterLink,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  firstName: string = '';
  lastName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isUserLoggedIn();

    if (this.isUserLoggedIn) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.firstName = currentUser.firstName;
        this.lastName = currentUser.lastName;
      }
    }
  }
}
