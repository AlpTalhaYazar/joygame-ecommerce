import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResult } from '../../../core/models/apiResult';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  getAllProductsEndpoint = `${environment.apiUrl}/api/product`;
  getProductsWithCategoriesEndpoint = `${environment.apiUrl}/api/product/with-categories`;

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.getAllProductsEndpoint);
  }

  getProductsWithCategories(page: number, pageSize: number) {
    return this.http
      .get<ApiResult<any>>(this.getProductsWithCategoriesEndpoint, {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString()
        },
      })
      .pipe(
        map((response: ApiResult<any>) => {
          return response;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }
}
