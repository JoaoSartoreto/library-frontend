import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  baseApi: string = '/categories';

  constructor(private readonly http: HttpClient) {}

  create(name: string): Observable<Category> {
    return this.http.post<Category>(environment.baseUrl + this.baseApi, {
      name,
    });
  }

  findById(id: string): Observable<Category> {
    return this.http.get<Category>(
      environment.baseUrl + this.baseApi + `/${id}`
    );
  }

  update(category: Category): Observable<Category> {
    const name = category.name;
    return this.http.patch<Category>(
      environment.baseUrl + this.baseApi + `/${category.id}`,
      { name }
    );
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(
      environment.baseUrl + this.baseApi + `/${id}`
    );
  }

  list(
    page: number,
    limit: number,
    search?: string
  ): Observable<ResponseDataList<Category>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ResponseDataList<Category>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
