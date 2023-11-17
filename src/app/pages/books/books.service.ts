import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookDto } from 'src/app/models/book.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BooksService {
  baseApi: string = '/books';

  constructor(private readonly http: HttpClient) {}

  create(book: BookDto): Observable<Book> {
    return this.http.post<Book>(environment.baseUrl + this.baseApi, book);
  }

  findById(id: string): Observable<Book> {
    return this.http.get<Book>(environment.baseUrl + this.baseApi + `/${id}`);
  }

  update(id: string, book: BookDto): Observable<Book> {
    return this.http.patch<Book>(
      environment.baseUrl + this.baseApi + `/${id}`,
      book
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
  ): Observable<ResponseDataList<Book>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ResponseDataList<Book>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
