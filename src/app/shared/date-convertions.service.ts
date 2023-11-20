import { Injectable } from '@angular/core';

import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class DateConvertionsService {
  constructor() {}

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
