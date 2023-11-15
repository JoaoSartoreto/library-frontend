import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Author } from 'src/app/models/author.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  baseApi: string = '/authors';

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly http: HttpClient
  ) {}

  create(fullName: string): Observable<Author> {
    return this.http.post<Author>(environment.baseUrl + this.baseApi, {
      fullName,
    });
  }

  findById(id: string): Observable<Author> {
    return this.http.get<Author>(environment.baseUrl + this.baseApi + `/${id}`);
  }

  update(author: Author): Observable<Author> {
    const fullName = author.fullName;
    return this.http.patch<Author>(
      environment.baseUrl + this.baseApi + `/${author.id}`,
      { fullName }
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
  ): Observable<ResponseDataList<Author>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ResponseDataList<Author>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
