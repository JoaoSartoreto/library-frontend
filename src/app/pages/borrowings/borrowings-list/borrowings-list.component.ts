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
import { Borrowing } from 'src/app/models/borrowing.model';

import { MessageComponent } from 'src/app/message/message.component';
import { BorrowingsService } from '../borrowings.service';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { MessagesService } from 'src/app/message/messages.service';
import { dateTypeValidator } from 'src/app/validators/data.validator';

@Component({
  selector: 'app-borrowings-list',
  templateUrl: './borrowings-list.component.html',
  styleUrls: ['./borrowings-list.component.scss'],
})
export class BorrowingsListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoadingResults: boolean = true;
  data: Borrowing[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = [
    'user',
    'book',
    'data_inicio',
    'data_fim',
    'return_date',
    'actions',
  ];
  form!: FormGroup;
  refresh: Subject<boolean> = new Subject();
  user: User | null = null;
  options = ['Todos', 'Devolvidos', 'Não devolvidos'];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly borrowingsService: BorrowingsService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    this.form = this.fb.group({
      search1: [null, dateTypeValidator()],
      search2: [null, dateTypeValidator()],
      isReturned: [null],
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
      .get('isReturned')!
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
          const search1 = this.borrowingsService.convertStringToDate(
            this.form.get('search1')?.value
          );
          const search2 = this.borrowingsService.convertStringToDate(
            this.form.get('search2')?.value
          );
          const isReturned = this.form.get('isReturned')?.value;
          return this.borrowingsService
            .list(
              this.paginator.pageIndex + 1,
              this.paginator.pageSize,
              search1,
              search2,
              isReturned
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

  navigateToBorrowingCreate() {
    this.router.navigate(['/borrowings/borrowing-create']);
  }

  borrowingInfo(borrowing: Borrowing) {
    this.router.navigate([`/borrowings/borrowing-info/${borrowing.id}`]);
  }

  returnBook(borrowing: Borrowing) {
    const dialogRef = this.dialog.open(MessageComponent, {
      data: 'Deseja mesmo devolver esse Livro?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.borrowingsService
          .returnBook(borrowing.id)
          .pipe(
            catchError((err) => {
              this.messageService.error('Livro não pôde ser devolvido!');
              return err;
            })
          )
          .subscribe(() => {
            this.paginator.firstPage();
            this.refresh.next(true);
            this.messageService.success('Livro devolvido com sucesso!');
          });
      }
    });
  }
}
