import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, lastValueFrom, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiResult, PaginationApiResult } from '../../../core/models/apiResult';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productBaseUrl = `${environment.apiUrl}/api/product`;
  private getProductByCategoryIdEndpoint = `${this.productBaseUrl}/category`;
  private getProductByIdDetailedEndpoint = `${this.productBaseUrl}/detailed`;
  private getProductsWithCategoriesEndpoint = `${this.productBaseUrl}/with-categories`;

  constructor(private http: HttpClient) {}

  async getProducts() {
    var response = this.http.get(this.productBaseUrl);

    return await lastValueFrom(response);
  }

  async getProductByIdDetail(id: number) {
    var response = this.http.get<ApiResult<any>>(
      `${this.getProductByIdDetailedEndpoint}/${id}`
    );

    return await lastValueFrom(response);
  }

  async getProductByCategoryId(categoryId: number) {
    var response = this.http.get<ApiResult<any>>(
      `${this.getProductByCategoryIdEndpoint}/${categoryId}`
    );

    return await lastValueFrom(response);
  }

  async getProductBySlugDetail(slug: string) {
    var response = this.http.get<ApiResult<any>>(
      `${this.productBaseUrl}/${slug}`
    );

    return await lastValueFrom(response);
  }

  async getProductsWithCategories(
    page: number,
    pageSize: number,
    categoryId: number | null,
    searchText: string | null
  ): Promise<PaginationApiResult<any>> {
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

    var response = this.http.get<PaginationApiResult<any>>(
      this.getProductsWithCategoriesEndpoint,
      {
        params,
      }
    );

    return await lastValueFrom(response);
  }
}
