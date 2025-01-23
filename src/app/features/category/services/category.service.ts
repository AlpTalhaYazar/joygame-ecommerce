import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, lastValueFrom, map, Observable } from 'rxjs';

import { ApiResult } from '../../../core/models/apiResult';
import { environment } from '../../../../environments/environment';
import {
  Category,
  CategoryTreeDto,
  CategoryWithHierarchy,
} from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiCategoryBaseUrl = `${environment.apiUrl}/api/category`;
  getCategoriesHierarchyEndpoint = `${this.apiCategoryBaseUrl}/hierarchy`;
  getCategoryTreeEndpoint = `${this.apiCategoryBaseUrl}/tree`;

  constructor(private http: HttpClient) {}

  async getCategories(): Promise<ApiResult<Category[]>> {
    var response = this.http.get<ApiResult<Category[]>>(
      this.apiCategoryBaseUrl
    );
    return await lastValueFrom(response);
  }

  async getCategoryBySlug(
    slug: string
  ): Promise<ApiResult<CategoryWithHierarchy>> {
    var response = this.http.get<ApiResult<CategoryWithHierarchy>>(
      `${this.apiCategoryBaseUrl}/${slug}`
    );

    return await lastValueFrom(response);
  }

  async getCategoryTree(slug: string): Promise<ApiResult<CategoryTreeDto[]>> {
    var response = this.http.get<ApiResult<CategoryTreeDto[]>>(
      this.getCategoryTreeEndpoint,
      {
        params: { slug },
      }
    );

    return await lastValueFrom(response);
  }

  async getCategoriesHierarchy(): Promise<ApiResult<CategoryWithHierarchy[]>> {
    var response = this.http.get<ApiResult<CategoryWithHierarchy[]>>(
      this.getCategoriesHierarchyEndpoint
    );

    return await lastValueFrom(response);
  }
}
