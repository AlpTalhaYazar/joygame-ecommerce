import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzRadioGroupComponent } from 'ng-zorro-antd/radio';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';

import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../services/category.service';
import { CategoryWithHierarchy } from '../interfaces/category.interface';
import { CategoryCardComponent } from '../category-card/category-card.component';

@Component({
  selector: 'app-category-listing-page',
  imports: [
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    NzRadioGroupComponent,
    FormsModule,
    NzInputGroupComponent,
    NzInputDirective,
    NzIconDirective,
    NzSpinComponent,
    NzRowDirective,
    NzColDirective,
    NgForOf,
    CategoryCardComponent,
    NzEmptyComponent,
    NgIf,
  ],
  templateUrl: './category-listing-page.component.html',
  styleUrl: './category-listing-page.component.scss',
})
export class CategoryListingPageComponent implements OnInit {
  loading = false;
  categories: CategoryWithHierarchy[] | null = [];
  filteredCategories: CategoryWithHierarchy[] = [];
  currentView: 'all' | 'main' | 'sub' = 'all';
  searchText = '';

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private notification: NzNotificationService
  ) {
    this.categoryService.getCategoriesHierarchy().subscribe((response) => {
      console.log(response);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    this.loading = true;
    this.categoryService.getCategoriesHierarchy().subscribe({
      next: async (response) => {
        if (response.isSuccess) {
          this.categories = response.data;
          await this.filterCategories();
        } else {
          this.notification.error(
            response?.error?.message || 'Failed to load categories',
            'Error'
          );
        }
      },
      error: (error) => {
        this.notification.error('Failed to load categories', 'Error');
        console.error('Error loading categories:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  async filterCategories(): Promise<void> {
    let filtered = [...(this.categories ?? [])];

    if (this.currentView === 'main') {
      filtered = filtered.filter((cat) => cat.level === 0);
    } else if (this.currentView === 'sub') {
      filtered = filtered.filter((cat) => cat.level === 1);
    }

    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchLower) ||
          cat.description.toLowerCase().includes(searchLower) ||
          cat.hierarchy.toLowerCase().includes(searchLower)
      );
    }

    this.filteredCategories = filtered;
  }
}
