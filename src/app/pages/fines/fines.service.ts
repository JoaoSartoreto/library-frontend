import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fine } from 'src/app/models/fine.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Injectable({
  providedIn: 'root',
})
export class FinesService {
  baseApi: string = '/fines';

  constructor(private readonly http: HttpClient) {}

  payFine(id: string): Observable<Fine> {
    return this.http.patch<Fine>(
      environment.baseUrl + this.baseApi + `/pay/${id}`,
      null
    );
  }

  list(
    page: number,
    limit: number,
    startingDateMin: Date | null,
    startingDateMax: Date | null,
    isPaid: string
  ): Observable<ResponseDataList<Fine>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (startingDateMin) {
      params = params.set('startingDateMin', startingDateMin.toISOString());
    }
    if (startingDateMax) {
      params = params.set('startingDateMax', startingDateMax.toISOString());
    }
    if (isPaid === 'Pagas') {
      params = params.set('isPaid', 'true');
    } else if (isPaid === 'Não pagas') {
      params = params.set('isPaid', 'false');
    }
    return this.http.get<ResponseDataList<Fine>>(
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
}
