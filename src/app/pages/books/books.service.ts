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
    title?: string,
    language?: string,
    year?: number,
    authorName?: string,
    tagName?: string,
    categoryName?: string,
    publisherName?: string
  ): Observable<ResponseDataList<Book>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (title?.trim()) {
      params = params.set('title', title.trim());
    }
    if (language?.trim()) {
      params = params.set('language', language.trim());
    }
    if (year) {
      params = params.set('year', year);
    }
    if (authorName?.trim()) {
      params = params.set('authorName', authorName.trim());
    }
    if (tagName?.trim()) {
      params = params.set('tagName', tagName.trim());
    }
    if (categoryName?.trim()) {
      params = params.set('categoryName', categoryName.trim());
    }
    if (publisherName?.trim()) {
      params = params.set('publisherName', publisherName.trim());
    }
    return this.http.get<ResponseDataList<Book>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
