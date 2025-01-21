import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { ProductCardComponent } from '../../product/product-card/product-card.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import {
  NzCollapseComponent,
  NzCollapsePanelComponent,
} from 'ng-zorro-antd/collapse';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';

import { Product } from '../../product/interfaces/product.interface';
import { environment } from '../../../../environments/environment';
import { ProductService } from '../../product/services/product.service';
import { CategoryService } from '../services/category.service';
import {
  CategoryTreeDto,
  CategoryWithHierarchy,
} from '../interfaces/category.interface';

@Component({
  selector: 'app-category-detail',
  imports: [
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    RouterLink,
    NzSpinComponent,
    NzCardComponent,
    NzAvatarComponent,
    NgIf,
    NzRowDirective,
    NzColDirective,
    CategoryCardComponent,
    NgForOf,
    FormsModule,
    ProductCardComponent,
    NzEmptyComponent,
    NzCollapsePanelComponent,
    NzCollapseComponent,
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent implements OnInit {
  loading = false;
  category: CategoryTreeDto | null = null;
  childCategories: CategoryWithHierarchy[] = [];
  products: Product[] = [];
  sortBy: string = 'name';
  environment = environment;

  subCategoriesExpanded = true;
  productsExpanded = true;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = this.route.snapshot.paramMap.get('slug');
      console.log('slug:', slug);
      if (slug) {
        this.loadCategoryData(slug);
      }
    });
  }

  loadCategoryData(slug: string) {
    this.loading = true;

    this.categoryService.getCategoryTree(slug).subscribe((response) => {
      this.category = response;
      this.childCategories = this.converCategortTreeToCategoryHierarchy(
        response?.children || []
      );
      this.loadProducts(response?.id || 0);
      this.loading = false;
    });
  }

  loadProducts(categoryId: number) {
    this.productService.getProductByCategoryId(categoryId).subscribe(
      (response) => {
        response.forEach((product: any) => {
          product.productId = product.id;
          product.productName = product.name;
          product.productDescription = product.description;
          product.productSlug = product.slug;
        });

        this.products = response;
        this.loading = false;
      },
      (error) => {
        this.notification.error('Error', 'Failed to load products');
        this.loading = false;
      }
    );
  }

  converCategortTreeToCategoryHierarchy(
    tree: CategoryTreeDto[]
  ): CategoryWithHierarchy[] {
    const hierarchy: CategoryWithHierarchy[] = [];

    tree.forEach((node) => {
      this.flattenCategoryTree(node, hierarchy, 0);
    });
    return hierarchy;
  }

  flattenCategoryTree(
    node: CategoryTreeDto,
    hierarchy: CategoryWithHierarchy[],
    level: number
  ) {
    const category: CategoryWithHierarchy = {
      id: node.id,
      name: node.name,
      description: node.description || '',
      slug: node.slug,
      parentId: node.parentId,
      hierarchy: node.name,
      level: level,
      imageUrl: '',
    };
    hierarchy.push(category);
    node.children.forEach((child) => {
      this.flattenCategoryTree(child, hierarchy, level + 1);
    });
  }
}
