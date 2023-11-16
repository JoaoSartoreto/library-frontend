import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publisher, PublisherDto } from 'src/app/models/publisher.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublishersService {
  baseApi: string = '/publishers';

  constructor(private readonly http: HttpClient) {}

  create(publisher: PublisherDto): Observable<Publisher> {
    return this.http.post<Publisher>(
      environment.baseUrl + this.baseApi,
      publisher
    );
  }

  findById(id: string): Observable<Publisher> {
    return this.http.get<Publisher>(
      environment.baseUrl + this.baseApi + `/${id}`
    );
  }

  update(id: string, publisher: PublisherDto): Observable<Publisher> {
    return this.http.patch<Publisher>(
      environment.baseUrl + this.baseApi + `/${id}`,
      publisher
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
  ): Observable<ResponseDataList<Publisher>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ResponseDataList<Publisher>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
