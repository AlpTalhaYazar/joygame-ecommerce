import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../services/product.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Product } from '../interfaces/product.interface';
import {NzBreadCrumbComponent, NzBreadCrumbItemComponent} from 'ng-zorro-antd/breadcrumb';
import {NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from 'ng-zorro-antd/input';
import {FormsModule} from '@angular/forms';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {NgForOf, NgIf} from '@angular/common';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {ProductCardComponent} from '../product-card/product-card.component';
import {NzEmptyComponent} from 'ng-zorro-antd/empty';
import {NzPaginationComponent} from 'ng-zorro-antd/pagination';

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
    NzPaginationComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  loading = false;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];

  // Pagination
  pageIndex = 1;
  pageSize = 12;
  total = 0;

  // Filters
  searchText = '';
  selectedCategory: string | null = null;

  constructor(
    private productService: ProductService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getProductsWithCategories(this.pageIndex, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.products = response.data;
            this.filteredProducts = this.products;
            this.total = response.data.length; // Update with actual total from backend
            this.updateCategories();
          } else {
            this.notification.error(
              'Failed to load products',
              response?.error?.message ?? 'An error occurred while loading products'
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

  updateCategories(): void {
    this.categories = [
      ...new Set(this.products.map((p) => p.categoryName)),
    ].sort();
  }

  onSearch(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
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

    if (this.selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryName === this.selectedCategory
      );
    }

    this.filteredProducts = filtered;
  }

  onPageSizeChange(): void {
    this.pageIndex = 1;
    this.loadProducts();
  }
}
