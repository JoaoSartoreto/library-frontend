import { HttpClient, HttpParams } from '@angular/common/http';
import { BinaryOperator } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Bibliography,
  BibliographyDto,
} from 'src/app/models/bibliography.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BibliographysService {
  baseApi: string = '/bibliographys';

  constructor(private readonly http: HttpClient) {}

  create(bibli: BibliographyDto): Observable<Bibliography> {
    return this.http.post<Bibliography>(
      environment.baseUrl + this.baseApi,
      bibli
    );
  }

  findById(id: string): Observable<Bibliography> {
    return this.http.get<Bibliography>(
      environment.baseUrl + this.baseApi + `/${id}`
    );
  }

  update(id: string, bibliography: BibliographyDto): Observable<Bibliography> {
    return this.http.patch<Bibliography>(
      environment.baseUrl + this.baseApi + `/${id}`,
      bibliography
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
  ): Observable<ResponseDataList<Bibliography>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ResponseDataList<Bibliography>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
