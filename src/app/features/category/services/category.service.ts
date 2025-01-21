import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs';

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

  getCategories() {
    return this.http.get<ApiResult<Category[]>>(this.apiCategoryBaseUrl).pipe(
      map((response: ApiResult<Category[]>) => {
        return response;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  getCategoryBySlug(slug: string) {
    return this.http
      .get<ApiResult<CategoryWithHierarchy>>(
        `${this.apiCategoryBaseUrl}/${slug}`
      )
      .pipe(
        map((response: ApiResult<CategoryWithHierarchy>) => {
          return response;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getCategoryTree(slug: string) {
    return this.http
      .get<ApiResult<CategoryTreeDto[]>>(this.getCategoryTreeEndpoint, {
        params: { slug },
      })
      .pipe(
        map((response: ApiResult<CategoryTreeDto[]>) => {
          if (response.data) {
            return response.data[0];
          } else {
            return null;
          }
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getCategoriesHierarchy() {
    return this.http
      .get<ApiResult<CategoryWithHierarchy[]>>(
        this.getCategoriesHierarchyEndpoint
      )
      .pipe(
        map((response: ApiResult<CategoryWithHierarchy[]>) => {
          return response;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }
}
