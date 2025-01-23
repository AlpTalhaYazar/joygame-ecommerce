import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';
import {
  NzInputDirective,
  NzInputGroupComponent,
  NzInputGroupWhitSuffixOrPrefixDirective,
} from 'ng-zorro-antd/input';
import {
  NzOptionComponent,
  NzOptionGroupComponent,
  NzSelectComponent,
} from 'ng-zorro-antd/select';

import { Product } from '../interfaces/product.interface';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../services/product.service';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { CategoryService } from '../../category/services/category.service';
import { ProductCardComponent } from '../product-card/product-card.component';

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
    NzTooltipDirective,
    NzInputDirective,
    NzIconDirective,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  loading = false;
  products: Product[] = [];
  filteredProducts: Product[] = [];

  parentCategories: { id: number; name: string }[] | [] = [];
  childCategories: { id: number; name: string }[] | [] = [];

  pageIndex = 1;
  pageSize = 12;
  total = 0;

  searchText = '';
  selectedCategory: number | null = null;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
    await this.loadCategories();
  }

  async loadProducts(): Promise<void> {
    this.loading = true;
    var response = await this.productService
      .getProductsWithCategories(
        this.pageIndex,
        this.pageSize,
        this.selectedCategory,
        this.searchText
      )
      .toPromise();

    if (response?.success) {
      this.products = response.data;
      this.filteredProducts = this.products;
      this.total = response.pagination?.totalCount ?? 0;
    } else {
      this.notification.error(
        'Error',
        response?.error?.message || 'An error occurred'
      );
    }

    this.loading = false;
  }

  async loadCategories(): Promise<void> {
    this.loading = true;
    var response = await this.categoryService.getCategories();

    if (response?.success && response.data) {
      this.parentCategories =
        response.data
          ?.filter((category) => category.parentId === null)
          .map((category) => ({ id: category.id, name: category.name })) ?? [];
      this.childCategories =
        response.data
          ?.filter((category) => category.parentId !== null)
          .map((category) => ({ id: category.id, name: category.name })) ?? [];
    } else {
      this.notification.error(
        'Error',
        response?.error?.message || 'An error occurred'
      );
    }

    this.loading = false;
  }

  async onSearch(): Promise<void> {
    this.pageIndex = 1;
    this.loadProducts();
  }

  async onCategoryChange(): Promise<void> {
    this.pageIndex = 1;
    this.loadProducts();
  }

  async onPageSizeChange(): Promise<void> {
    this.pageIndex = 1;
    this.loadProducts();
  }
}
