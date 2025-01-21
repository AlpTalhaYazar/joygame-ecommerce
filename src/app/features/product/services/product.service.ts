import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResult, PaginationApiResult } from '../../../core/models/apiResult';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  getAllProductsEndpoint = `${environment.apiUrl}/api/product`;
  getProductByIdDetailedEndpoint = `${environment.apiUrl}/api/product/detailed`;
  getProductBySlugDetailedEndpoint = `${environment.apiUrl}/api/product`;
  getProductsWithCategoriesEndpoint = `${environment.apiUrl}/api/product/with-categories`;

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.getAllProductsEndpoint);
  }

  getProductByIdDetail(id: number) {
    return this.http
      .get<ApiResult<any>>(`${this.getProductByIdDetailedEndpoint}/${id}`)
      .pipe(
        map((response: ApiResult<any>) => {
          return response.data;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getProductBySlugDetail(slug: string) {
    return this.http
      .get<ApiResult<any>>(`${this.getProductBySlugDetailedEndpoint}/${slug}`)
      .pipe(
        map((response: ApiResult<any>) => {
          return response.data;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getProductsWithCategories(
    page: number,
    pageSize: number,
    categoryId: number | null,
    searchText: string | null
  ) {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (categoryId) {
      params['categoryId'] = categoryId.toString();
    }

    if (searchText) {
      params['searchText'] = searchText;
    }

    return this.http
      .get<PaginationApiResult<any>>(this.getProductsWithCategoriesEndpoint, {
        params,
      })
      .pipe(
        map((response: PaginationApiResult<any>) => {
          return response;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }
}
