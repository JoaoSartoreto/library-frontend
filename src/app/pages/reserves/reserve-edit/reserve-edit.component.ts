import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { ReservesService } from '../reserves.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Reserve, ReserveDto } from 'src/app/models/reserve.model';
import { dateTimeTypeValidator } from 'src/app/validators/data.validator';

@Component({
  selector: 'app-reserve-edit',
  templateUrl: './reserve-edit.component.html',
  styleUrls: ['./reserve-edit.component.scss'],
})
export class ReserveEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  reserve!: Reserve;

  constructor(
    private readonly fb: FormBuilder,
    private readonly reservesService: ReservesService,
    private readonly messageService: MessagesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      startDate: [null, [Validators.required, dateTimeTypeValidator()]],
      endDate: [null, [Validators.required, dateTimeTypeValidator()]],
      bookId: [null, [Validators.required]],
    });

    const sub = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.reservesService.findById(id).subscribe((reserve) => {
        this.reserve = reserve;

        this.form.patchValue({
          startDate: this.reservesService.converterData(this.reserve.startDate),
          endDate: this.reservesService.converterData(this.reserve.endDate),
          bookId: this.reserve.book.id,
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
      const startDate = this.reservesService
        .convertStringDtToDate(this.form.get('startDate')?.value)
        ?.toString();
      const endDate = this.reservesService
        .convertStringDtToDate(this.form.get('endDate')?.value)
        ?.toString();
      const bookId = this.form.get('bookId')?.value;

      if (startDate && endDate) {
        const reserve: ReserveDto = {
          startDate,
          endDate,
          bookId,
        };
        const sub = this.reservesService
          .create(reserve)
          .pipe(
            catchError((err) => {
              this.messageService.error('Reserva não pode ser atualizada!');
              return err;
            })
          )
          .subscribe((resp) => {
            this.messageService.success('Reserva atualizada com sucesso!');
            this.router.navigate(['/reserves']);
          });
        this.subscription.push(sub);
      } else {
        this.messageService.error('Há campos inválidos no formulário!');
      }
    }
  }

  cancelar() {
    this.router.navigate(['/reserves']);
  }
}
