import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { ApiResult } from '../../../core/models/apiResult';
import { catchError, map } from 'rxjs';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  getAllCategoriesEndpoint = `${environment.apiUrl}/api/category`;
  getCategoriesHierarchyEndpoint = `${environment.apiUrl}/api/category/hierarchy`;

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get(this.getAllCategoriesEndpoint);
  }

  getCategoriesHierarchy() {
    return this.http
      .get<ApiResult<Category[]>>(this.getCategoriesHierarchyEndpoint)
      .pipe(
        map((response: ApiResult<Category[]>) => {
          return response;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }
}
