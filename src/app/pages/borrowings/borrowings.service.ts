import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Borrowing, BorrowingDto } from 'src/app/models/borrowing.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Injectable({
  providedIn: 'root',
})
export class BorrowingsService {
  baseApi: string = '/borrowings';

  constructor(private readonly http: HttpClient) {}

  create(borrowing: BorrowingDto): Observable<Borrowing> {
    return this.http.post<Borrowing>(
      environment.baseUrl + this.baseApi,
      borrowing
    );
  }

  findById(id: string): Observable<Borrowing> {
    return this.http.get<Borrowing>(
      environment.baseUrl + this.baseApi + `/${id}`
    );
  }

  returnBook(id: string): Observable<Borrowing> {
    return this.http.patch<Borrowing>(
      environment.baseUrl + this.baseApi + `/return/${id}`,
      null
    );
  }

  list(
    page: number,
    limit: number,
    startingDateMin: Date | null,
    startingDateMax: Date | null,
    isReturned: string
  ): Observable<ResponseDataList<Borrowing>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (startingDateMin) {
      params = params.set('startingDateMin', startingDateMin.toISOString());
    }
    if (startingDateMax) {
      params = params.set('startingDateMax', startingDateMax.toISOString());
    }
    if (isReturned === 'Devolvidos') {
      params = params.set('isReturned', 'true');
    } else if (isReturned === 'Não devolvidos') {
      params = params.set('isReturned', 'false');
    }
    return this.http.get<ResponseDataList<Borrowing>>(
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
