import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  baseApi: string = '/tags';

  constructor(private readonly http: HttpClient) {}

  create(name: string): Observable<Tag> {
    return this.http.post<Tag>(environment.baseUrl + this.baseApi, {
      name,
    });
  }

  findById(id: string): Observable<Tag> {
    return this.http.get<Tag>(environment.baseUrl + this.baseApi + `/${id}`);
  }

  update(tag: Tag): Observable<Tag> {
    const name = tag.name;
    return this.http.patch<Tag>(
      environment.baseUrl + this.baseApi + `/${tag.id}`,
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
  ): Observable<ResponseDataList<Tag>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ResponseDataList<Tag>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
