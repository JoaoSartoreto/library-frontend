import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { LibraryConfigurationsService } from '../library-configurations.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';
import { LibraryConfigurationDto } from 'src/app/models/library-configuration.model';
import { dateTimeTypeValidator } from 'src/app/validators/data.validator';
import { DateConvertionsService } from 'src/app/shared/date-convertions.service';

@Component({
  selector: 'app-library-configuration-create',
  templateUrl: './library-configuration-create.component.html',
  styleUrls: ['./library-configuration-create.component.scss'],
})
export class LibraryConfigurationCreateComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly libraryService: LibraryConfigurationsService,
    private readonly dateService: DateConvertionsService,
    private readonly messageService: MessagesService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      startingDate: [null, [Validators.required, dateTimeTypeValidator()]],
      dailyFine: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      maxBorrowedBooksByUser: [
        null,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      maxBorrowingDurationDays: [
        null,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      maxReservesByUser: [
        null,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  salvar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const startingDate = this.dateService
        .convertStringDtToDate(this.form.get('startingDate')?.value)
        ?.toString();
      const dailyFine = this.form.get('dailyFine')?.value;
      const maxBorrowedBooksByUser = this.form.get(
        'maxBorrowedBooksByUser'
      )?.value;
      const maxBorrowingDurationDays = this.form.get(
        'maxBorrowingDurationDays'
      )?.value;
      const maxReservesByUser = this.form.get('maxReservesByUser')?.value;

      if (startingDate) {
        const library: LibraryConfigurationDto = {
          startingDate,
          dailyFine,
          maxBorrowedBooksByUser,
          maxBorrowingDurationDays,
          maxReservesByUser,
        };
        const sub = this.libraryService
          .create(library)
          .pipe(
            catchError((err) => {
              this.messageService.error(
                'Configuração não pode ser cadastrada!'
              );
              return err;
            })
          )
          .subscribe((resp) => {
            this.messageService.success('Configuração cadastrada com sucesso!');
            this.router.navigate(['/library-configurations']);
          });
        this.subscription.push(sub);
      }
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  cancelar() {
    this.router.navigate(['/library-configurations']);
  }
}
