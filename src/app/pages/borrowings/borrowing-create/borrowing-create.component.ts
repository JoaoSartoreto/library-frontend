import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { BorrowingsService } from '../borrowings.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';
import { BorrowingDto } from 'src/app/models/borrowing.model';
import { dateTimeTypeValidator } from 'src/app/validators/data.validator';

@Component({
  selector: 'app-borrowing-create',
  templateUrl: './borrowing-create.component.html',
  styleUrls: ['./borrowing-create.component.scss'],
})
export class BorrowingCreateComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly borrowingsService: BorrowingsService,
    private readonly messageService: MessagesService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      startDate: [null, [Validators.required, dateTimeTypeValidator()]],
      endDate: [null, [Validators.required, dateTimeTypeValidator()]],
      email: [null, [Validators.required, Validators.email]],
      bookId: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  salvar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const startDate = this.borrowingsService
        .convertStringDtToDate(this.form.get('startDate')?.value)
        ?.toString();
      const endDate = this.borrowingsService
        .convertStringDtToDate(this.form.get('endDate')?.value)
        ?.toString();
      const email = this.form.get('email')?.value;
      const bookId = this.form.get('bookId')?.value;

      if (startDate && endDate) {
        const reserve: BorrowingDto = {
          startDate,
          endDate,
          email,
          bookId,
        };
        const sub = this.borrowingsService
          .create(reserve)
          .pipe(
            catchError((err) => {
              this.messageService.error('Empréstimo não pode ser cadastrado!');
              return err;
            })
          )
          .subscribe((resp) => {
            this.messageService.success('Empréstimo cadastrado com sucesso!');
            this.router.navigate(['/borrowings']);
          });
        this.subscription.push(sub);
      } else {
        this.messageService.error('Há campos inválidos no formulário!');
      }
    }
  }

  cancelar() {
    this.router.navigate(['/borrowings']);
  }
}
