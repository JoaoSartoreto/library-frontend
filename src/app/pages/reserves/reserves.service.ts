import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserve, ReserveDto } from 'src/app/models/reserve.model';
import { ResponseDataList } from 'src/app/models/shared.model';
import { environment } from 'src/environments/environment';

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
      params = params.set(
        'startingDateMin',
        startingDateMin.toLocaleDateString()
      );
    }
    if (startingDateMax) {
      params = params.set(
        'startingDateMax',
        startingDateMax.toLocaleDateString()
      );
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
    if (dateString && dateString !== '') {
      const dateParts = dateString.split('/');

      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Mês começa do zero (0 a 11)
        const year = parseInt(dateParts[2], 10);

        // Verifica se é uma data válida
        const testDate = new Date(year, month, day);
        if (
          testDate.getDate() === day &&
          testDate.getMonth() === month &&
          testDate.getFullYear() === year
        ) {
          return testDate; // Retorna a data válida no formato Date
        }
      }
    }
    return null; // Retorna null se a string não for uma data válida no formato DD/MM/YYYY
  }

  public convertStringDtToDate(dateString: string): Date | null {
    if (dateString && dateString !== '') {
      const dateTimeParts = dateString.split(' ');
      if (dateTimeParts.length === 2) {
        const date = dateTimeParts[0];
        const time = dateTimeParts[1];

        const dateParts = date.split('/');
        const timeParts = time.split(':');

        if (dateParts.length === 3 && timeParts.length === 2) {
          const day = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // Mês começa do zero (0 a 11)
          const year = parseInt(dateParts[2], 10); // Ano de 4 dígitos

          const hour = parseInt(timeParts[0], 10);
          const minute = parseInt(timeParts[1], 10);

          // Verifica se é uma data e hora válidas
          const testDate = new Date(year, month, day, hour, minute);
          if (
            testDate.getDate() === day &&
            testDate.getMonth() === month &&
            testDate.getFullYear() === year &&
            testDate.getHours() === hour &&
            testDate.getMinutes() === minute
          ) {
            return testDate; // Retorna a data e hora válidas no formato Date
          }
        }
      }
    }
    return null; // Retorna null se a string não for uma data e hora válidas no formato DD/MM/YYYY HH:mm
  }
}
