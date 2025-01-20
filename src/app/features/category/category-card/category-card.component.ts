import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, Input } from '@angular/core';

import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { CategoryWithHierarchy } from '../interfaces/category.interface';

@Component({
  selector: 'app-category-card',
  imports: [
    NzCardComponent,
    RouterLink,
    NzTagComponent,
    NgIf,
    NzAvatarComponent,
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  @Input() category!: CategoryWithHierarchy;

  canManageCategory = false;
  environment: any;

  constructor(private authService: AuthService) {
    this.canManageCategory = this.authService.hasPermission('category_manage');
    this.environment = environment;
  }

  getCategoryIcon(): string {
    const iconMap: { [key: string]: string } = {
      Games: 'play-circle',
      Consoles: 'desktop',
      Accessories: 'tool',
      Merchandise: 'shopping',
      Controllers: 'control',
      Headsets: 'audio',
      Keyboards: 'laptop',
      'Action Games': 'thunderbolt',
      'RPG Games': 'crown',
      'Sports Games': 'trophy',
      'Puzzle Games': 'puzzle',
      'Shooter Games': 'aim',
    };

    return iconMap[this.category.name] || 'folder';
  }
}
