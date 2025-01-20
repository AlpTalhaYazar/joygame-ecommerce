import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../interfaces/category.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';
import { NzRadioGroupComponent } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NgForOf, NgIf } from '@angular/common';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';

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
  categories: Category[] = [];
  filteredCategories: Category[] = [];
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

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategoriesHierarchy().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.categories = response.data;
          this.filterCategories();
        } else {
          this.notification.error(
            response.error.message || 'Failed to load categories',
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

  filterCategories(): void {
    let filtered = [...this.categories];

    // Filter by view type
    if (this.currentView === 'main') {
      filtered = filtered.filter((cat) => cat.level === 0);
    } else if (this.currentView === 'sub') {
      filtered = filtered.filter((cat) => cat.level === 1);
    }

    // Filter by search text
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
