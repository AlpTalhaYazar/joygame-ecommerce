import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  NzBreadCrumbComponent,
  NzBreadCrumbItemComponent,
} from 'ng-zorro-antd/breadcrumb';

import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product.interface';
import { NgIf } from '@angular/common';
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
export class ProductDetailComponent {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    const productSlug = this.route.snapshot.params['slug'];
    this.loadProduct(productSlug);
  }

  loadProduct(slug: string): void {
    this.productService.getProductBySlugDetail(slug).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        this.notification.error('Error', 'Product not found');
        this.router.navigate(['/app/products']);
      },
    });
  }
}
