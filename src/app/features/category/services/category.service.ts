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
  private categoryBaseUrl = `${environment.apiUrl}/api/category`;
  private getCategoriesHierarchyEndpoint = `${this.categoryBaseUrl}/hierarchy`;
  private getCategoryTreeEndpoint = `${this.categoryBaseUrl}/tree`;

  constructor(private http: HttpClient) {}

  async getCategories(): Promise<ApiResult<Category[]>> {
    var response = this.http.get<ApiResult<Category[]>>(this.categoryBaseUrl);
    return await lastValueFrom(response);
  }

  async getCategoryBySlug(
    slug: string
  ): Promise<ApiResult<CategoryWithHierarchy>> {
    var response = this.http.get<ApiResult<CategoryWithHierarchy>>(
      `${this.categoryBaseUrl}/${slug}`
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
