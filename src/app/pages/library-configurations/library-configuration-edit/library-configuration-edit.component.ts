import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { LibraryConfigurationsService } from '../library-configurations.service';
import { MessagesService } from 'src/app/message/messages.service';
import {
  LibraryConfiguration,
  LibraryConfigurationDto,
} from 'src/app/models/library-configuration.model';
import { dateTimeTypeValidator } from 'src/app/validators/data.validator';
import { DateConvertionsService } from 'src/app/shared/date-convertions.service';

@Component({
  selector: 'app-library-configuration-edit',
  templateUrl: './library-configuration-edit.component.html',
  styleUrls: ['./library-configuration-edit.component.scss'],
})
export class LibraryConfigurationEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  library!: LibraryConfiguration;

  constructor(
    private readonly fb: FormBuilder,
    private readonly libraryService: LibraryConfigurationsService,
    private readonly dateService: DateConvertionsService,
    private readonly messageService: MessagesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
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

    const sub = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.libraryService.findById(id).subscribe((library) => {
        this.library = library;

        this.form.patchValue({
          startingDate: this.dateService.converterData(
            this.library.startingDate
          ),
          dailyFine: this.library.dailyFine,
          maxBorrowedBooksByUser: this.library.maxBorrowedBooksByUser,
          maxBorrowingDurationDays: this.library.maxBorrowingDurationDays,
          maxReservesByUser: this.library.maxReservesByUser,
        });
      });

      this.subscription.push(sub);
    });

    this.subscription.push(sub);
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
          .update(this.library.id, library)
          .pipe(
            catchError((err) => {
              this.messageService.error(
                'Configuração não pode ser atualizada!'
              );
              return err;
            })
          )
          .subscribe((resp) => {
            this.messageService.success('Configuração atualizada com sucesso!');
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
