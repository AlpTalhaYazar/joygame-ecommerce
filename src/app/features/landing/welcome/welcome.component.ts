import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {NzListComponent, NzListItemComponent} from 'ng-zorro-antd/list';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzCardComponent } from 'ng-zorro-antd/card';

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
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
