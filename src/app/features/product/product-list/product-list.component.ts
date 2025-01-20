import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../services/product.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Product } from '../interfaces/product.interface';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';
import {
  NzInputGroupComponent,
  NzInputGroupWhitSuffixOrPrefixDirective,
} from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import {NzOptionComponent, NzOptionGroupComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NgForOf, NgIf } from '@angular/common';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { ProductCardComponent } from '../product-card/product-card.component';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { CategoryService } from '../../category/services/category.service';

@Component({
  selector: 'app-product-list',
  imports: [
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzInputGroupComponent,
    FormsModule,
    NzSelectComponent,
    NzOptionComponent,
    NzSpinComponent,
    NgIf,
    NzRowDirective,
    NzColDirective,
    NgForOf,
    ProductCardComponent,
    NzEmptyComponent,
    NzPaginationComponent,
    NzOptionGroupComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  loading = false;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  parentCategories: { id: number; name: string }[] | [] = [];
  childCategories: { id: number; name: string }[] | [] = [];
  categories: { id: string; name: string }[] = [];

  pageIndex = 1;
  pageSize = 12;
  total = 0;

  searchText = '';
  selectedCategory: number | null = null;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getProductsWithCategories(this.pageIndex, this.pageSize, this.selectedCategory, this.searchText)
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.products = response.data;
            this.filteredProducts = this.products;
            this.total = response.total;
          } else {
            this.notification.error(
              'Failed to load products',
              response?.error?.message ??
                'An error occurred while loading products'
            );
          }
        },
        error: (error) => {
          this.notification.error(
            'Failed to load products',
            'An error occurred while loading products'
          );
          console.error('Error loading products:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.parentCategories =
            response.data
              ?.filter((category) => category.parentId === null)
              .map((category) => ({ id: category.id, name: category.name })) ??
            [];
          this.childCategories =
            response.data
              ?.filter((category) => category.parentId !== null)
              .map((category) => ({ id: category.id, name: category.name })) ??
            [];
        }
      },
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  filterProducts(): void {
    let filtered = [...this.products];

    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchLower) ||
          product.productDescription.toLowerCase().includes(searchLower)
      );
    }

    this.filteredProducts = filtered;
  }

  onPageSizeChange(): void {
    this.pageIndex = 1;
    this.loadProducts();
  }
}
