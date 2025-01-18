import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./features/product/product.module').then(
            (m) => m.ProductModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/category/category.module').then(
            (m) => m.CategoryModule
          ),
      },
    ],
  },
];
