import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  of,
  startWith,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { Fine } from 'src/app/models/fine.model';

import { MessageComponent } from 'src/app/message/message.component';
import { FinesService } from '../fines.service';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { MessagesService } from 'src/app/message/messages.service';
import { dateTypeValidator } from 'src/app/validators/data.validator';
import { DateConvertionsService } from 'src/app/shared/date-convertions.service';

@Component({
  selector: 'app-fines-list',
  templateUrl: './fines-list.component.html',
  styleUrls: ['./fines-list.component.scss'],
})
export class FinesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoadingResults: boolean = true;
  data: Fine[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = [
    'user',
    'book',
    'data_inicio',
    'data_fim',
    'dailyFine',
    'isPaid',
    'actions',
  ];
  form!: FormGroup;
  refresh: Subject<boolean> = new Subject();
  user: User | null = null;
  options = ['Todas', 'Pagas', 'Não pagas'];
  valorMulta!: number;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly finesService: FinesService,
    private readonly dateService: DateConvertionsService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    this.form = this.fb.group({
      search1: [null, dateTypeValidator()],
      search2: [null, dateTypeValidator()],
      isPaid: [null],
    });

    const sub1 = this.form
      .get('search1')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub1);

    const sub2 = this.form
      .get('search2')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub2);

    const sub3 = this.form
      .get('isPaid')!
      .valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub3);
  }

  ngAfterViewInit(): void {
    const sub = merge(this.refresh, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const search1 = this.dateService.convertStringToDate(
            this.form.get('search1')?.value
          );
          const search2 = this.dateService.convertStringToDate(
            this.form.get('search2')?.value
          );
          const isPaid = this.form.get('isPaid')?.value;
          return this.finesService
            .list(
              this.paginator.pageIndex + 1,
              this.paginator.pageSize,
              search1,
              search2,
              isPaid
            )
            .pipe(catchError(() => of(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          if (data) {
            this.resultsLength = data.meta.totalItems;
            return data.items;
          }
          return [];
        })
      )
      .subscribe((data) => (this.data = data));
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  payFine(fine: Fine) {
    const dialogRef = this.dialog.open(MessageComponent, {
      data: 'Deseja mesmo pagar essa Multa?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.finesService
          .payFine(fine.id)
          .pipe(
            catchError((err) => {
              this.messageService.error('Multa não pôde ser paga!');
              return err;
            })
          )
          .subscribe(() => {
            this.paginator.firstPage();
            this.refresh.next(true);
            this.messageService.success('Multa paga com sucesso!');
          });
      }
    });
  }

  diferencaEntreDatasEmDias(dataInicial: Date, dataFinal: Date): number {
    if (!dataFinal) {
      dataFinal = new Date();
    }
    // Calcula a diferença em milissegundos
    const diferencaEmMilissegundos = Math.abs(
      dataFinal.getTime() - dataInicial.getTime()
    );

    // Converte a diferença de milissegundos para dias
    const dias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

    return dias;
  }
}
