import { RouterLink } from '@angular/router';
import { Component, Input } from '@angular/core';

import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzCardComponent, NzCardMetaComponent } from 'ng-zorro-antd/card';

import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [NzCardComponent, RouterLink, NzCardMetaComponent, NzTagComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;

  getCategoryColor(): string {
    const colorMap: { [key: string]: string } = {
      'Action Games': 'blue',
      'RPG Games': 'purple',
      'Sports Games': 'green',
      'Shooter Games': 'red',
      'Puzzle Games': 'orange',
      Controllers: 'cyan',
      Headsets: 'geekblue',
      Keyboards: 'magenta',
      Accessories: 'gold',
      Merchandise: 'lime',
    };

    return colorMap[this.product.categoryName] || 'default';
  }
}
