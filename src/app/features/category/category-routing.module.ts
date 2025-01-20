import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryService } from './services/category.service';
import { CategoryCardComponent } from './category-card/category-card.component';
import { CategoryListingPageComponent } from './category-listing-page/category-listing-page.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryListingPageComponent,
  },
  {
    path: ':slug',
    component: CategoryCardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
