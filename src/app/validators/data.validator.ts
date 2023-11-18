import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateTypeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // Expressão regular para validar o formato DD/MM/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (value && typeof value === 'string' && dateRegex.test(value)) {
      const parts = value.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mês começa do zero (0 a 11)
      const year = parseInt(parts[2], 10);

      // Verificando se a data é válida no objeto Date
      const testDate = new Date(year, month, day);
      if (
        testDate.getDate() === day &&
        testDate.getMonth() === month &&
        testDate.getFullYear() === year
      ) {
        return null; // Valor é uma data válida no formato DD/MM/YYYY
      }
    }

    return { invalidDate: { value: control.value } }; // Valor não é uma data válida no formato DD/MM/YYYY
  };
}

export function dateTimeTypeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // Expressão regular para validar o formato DD/MM/YY HH:mm
    const dateTimeRegex = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}$/;

    if (value && typeof value === 'string' && dateTimeRegex.test(value)) {
      const parts = value.split(' ');
      const dateParts = parts[0].split('/');
      const timeParts = parts[1].split(':');

      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Mês começa do zero (0 a 11)
      const year = 2000 + parseInt(dateParts[2], 10); // Aqui, assumimos que o ano está no formato YY e adicionamos 2000

      const hour = parseInt(timeParts[0], 10);
      const minute = parseInt(timeParts[1], 10);

      // Verificando se a data e hora são válidas no objeto Date
      const testDate = new Date(year, month, day, hour, minute);
      if (
        testDate.getDate() === day &&
        testDate.getMonth() === month &&
        testDate.getFullYear() === year &&
        testDate.getHours() === hour &&
        testDate.getMinutes() === minute
      ) {
        return null; // Valor é uma data e hora válidas no formato DD/MM/YY HH:mm
      }
    }

    return { invalidDateTime: { value: control.value } }; // Valor não é uma data e hora válidas no formato DD/MM/YY HH:mm
  };
}
