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
import { Router } from '@angular/router';
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
import { Reserve } from 'src/app/models/reserve.model';

import { MessageComponent } from 'src/app/message/message.component';
import { ReservesService } from '../reserves.service';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { MessagesService } from 'src/app/message/messages.service';
import { dateTypeValidator } from 'src/app/validators/data.validator';

@Component({
  selector: 'app-reserves-list',
  templateUrl: './reserves-list.component.html',
  styleUrls: ['./reserves-list.component.scss'],
})
export class ReservesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoadingResults: boolean = true;
  data: Reserve[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = [
    'user',
    'book',
    'data_inicio',
    'data_fim',
    'valido',
    'actions',
  ];
  form!: FormGroup;
  refresh: Subject<boolean> = new Subject();
  user: User | null = null;
  options = ['Todas', 'Validas', 'Invalidas'];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly reservesService: ReservesService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    this.form = this.fb.group({
      search1: [null, dateTypeValidator()],
      search2: [null, dateTypeValidator()],
      onlyValid: [null],
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
      .get('onlyValid')!
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
          const search1 = this.reservesService.convertStringToDate(
            this.form.get('search1')?.value
          );
          const search2 = this.reservesService.convertStringToDate(
            this.form.get('search2')?.value
          );
          const select = this.form.get('onlyValid')?.value;
          return this.reservesService
            .list(
              this.paginator.pageIndex + 1,
              this.paginator.pageSize,
              search1,
              search2,
              select
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

  navigateToReserveCreate() {
    this.router.navigate(['/reserves/reserve-create']);
  }

  openDeleteDialog(reserve: Reserve) {
    const dialogRef = this.dialog.open(MessageComponent, {
      data: 'Deseja mesmo excluir essa reserva?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reservesService
          .delete(reserve.id)
          .pipe(
            catchError((err) => {
              this.messageService.error('Reserva não pode ser excluida!');
              return err;
            })
          )
          .subscribe(() => {
            this.paginator.firstPage();
            this.refresh.next(true);
            this.messageService.success('Reserva excluída com sucesso!');
          });
      }
    });
  }
}
