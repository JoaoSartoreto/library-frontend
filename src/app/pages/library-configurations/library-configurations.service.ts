import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LibraryConfiguration,
  LibraryConfigurationDto,
} from 'src/app/models/library-configuration.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';

import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class LibraryConfigurationsService {
  baseApi: string = '/library-configurations';

  constructor(private readonly http: HttpClient) {}

  create(library: LibraryConfigurationDto): Observable<LibraryConfiguration> {
    return this.http.post<LibraryConfiguration>(
      environment.baseUrl + this.baseApi,
      library
    );
  }

  findById(id: string): Observable<LibraryConfiguration> {
    return this.http.get<LibraryConfiguration>(
      environment.baseUrl + this.baseApi + `/${id}`
    );
  }

  update(
    id: string,
    library: LibraryConfigurationDto
  ): Observable<LibraryConfiguration> {
    return this.http.patch<LibraryConfiguration>(
      environment.baseUrl + this.baseApi + `/${id}`,
      library
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
    startingDateMin: Date | null,
    startingDateMax: Date | null
  ): Observable<ResponseDataList<LibraryConfiguration>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (startingDateMin) {
      params = params.set('startingDateMin', startingDateMin.toISOString());
    }
    if (startingDateMax) {
      params = params.set('startingDateMax', startingDateMax.toISOString());
    }
    return this.http.get<ResponseDataList<LibraryConfiguration>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }
}
