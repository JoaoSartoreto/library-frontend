import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserve, ReserveDto } from 'src/app/models/reserve.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Injectable({
  providedIn: 'root',
})
export class ReservesService {
  baseApi: string = '/reserves';

  constructor(private readonly http: HttpClient) {}

  create(reserve: ReserveDto): Observable<Reserve> {
    return this.http.post<Reserve>(environment.baseUrl + this.baseApi, reserve);
  }

  findById(id: string): Observable<Reserve> {
    return this.http.get<Reserve>(
      environment.baseUrl + this.baseApi + `/${id}`
    );
  }

  update(id: string, reserve: ReserveDto): Observable<Reserve> {
    return this.http.patch<Reserve>(
      environment.baseUrl + this.baseApi + `/${id}`,
      reserve
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
    startingDateMax: Date | null,
    onlyValid: string
  ): Observable<ResponseDataList<Reserve>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (startingDateMin) {
      params = params.set('startingDateMin', startingDateMin.toISOString());
    }
    if (startingDateMax) {
      params = params.set('startingDateMax', startingDateMax.toISOString());
    }
    if (onlyValid === 'Validas') {
      params = params.set('onlyValid', 'true');
    } else if (onlyValid === 'Invalidas') {
      params = params.set('onlyValid', 'false');
    }
    return this.http.get<ResponseDataList<Reserve>>(
      environment.baseUrl + this.baseApi,
      { params }
    );
  }

  public convertStringToDate(dateString: string): Date | null {
    try {
      const date = dayjs(dateString, 'DD/MM/YYYY');

      if (!date.isValid()) return null;

      return date.toDate();
    } catch (error) {
      return null; // Retorna null se a string não for uma data válida no formato DD/MM/YYYY
    }
  }

  public convertStringDtToDate(dateString: string): Date | null {
    try {
      const date = dayjs(dateString, 'DD/MM/YYYY HH:mm');

      if (!date.isValid()) return null;

      return date.toDate();
    } catch (error) {
      return null; // Retorna null se a string não for uma data válida no formato DD/MM/YYYY
    }
  }

  converterData(dataOriginal: Date) {
    // Converter para o formato desejado (DD/MM/YYYY HH:mm)
    const dataConvertida = dayjs(dataOriginal).format('DD/MM/YYYY HH:mm');
    return dataConvertida;
  }
}
