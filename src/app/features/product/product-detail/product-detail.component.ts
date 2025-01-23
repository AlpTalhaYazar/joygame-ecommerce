import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';

import { Product } from '../interfaces/product.interface';
import { ProductService } from '../services/product.service';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-product-detail',
  imports: [
    NzButtonComponent,
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    RouterLink,
    NzCardComponent,
    NzTagComponent,
    NgIf,
    NzTooltipDirective,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notification: NzNotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    const productSlug = this.route.snapshot.params['slug'];
    await this.loadProduct(productSlug);
  }

  async loadProduct(slug: string): Promise<void> {
    var response = await this.productService.getProductBySlugDetail(slug);

    if (response.success) {
      this.product = response.data;
    } else {
      this.notification.error(
        'Error',
        response?.error?.message || 'An error occurred'
      );
    }
  }
}
