import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryListingPageComponent } from './category-listing-page/category-listing-page.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryListingPageComponent,
  },
  {
    path: ':slug',
    component: CategoryDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
