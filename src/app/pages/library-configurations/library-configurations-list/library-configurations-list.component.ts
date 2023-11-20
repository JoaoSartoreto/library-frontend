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
import { LibraryConfiguration } from 'src/app/models/library-configuration.model';

import { MessageComponent } from 'src/app/message/message.component';
import { LibraryConfigurationsService } from '../library-configurations.service';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { MessagesService } from 'src/app/message/messages.service';
import { dateTypeValidator } from 'src/app/validators/data.validator';

@Component({
  selector: 'app-library-configurations-list',
  templateUrl: './library-configurations-list.component.html',
  styleUrls: ['./library-configurations-list.component.scss'],
})
export class LibraryConfigurationsListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoadingResults: boolean = true;
  data: LibraryConfiguration[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = [
    'startingDate',
    'dailyFine',
    'maxBorrowedBooksByUser',
    'maxBorrowingDurationDays',
    'maxReservesByUser',
    'actions',
  ];
  form!: FormGroup;
  refresh: Subject<boolean> = new Subject();
  user: User | null = null;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly libraryService: LibraryConfigurationsService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    this.form = this.fb.group({
      search1: [null, dateTypeValidator()],
      search2: [null, dateTypeValidator()],
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
  }

  ngAfterViewInit(): void {
    const sub = merge(this.refresh, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const search1 = this.libraryService.convertStringToDate(
            this.form.get('search1')?.value
          );
          const search2 = this.libraryService.convertStringToDate(
            this.form.get('search2')?.value
          );
          return this.libraryService
            .list(
              this.paginator.pageIndex + 1,
              this.paginator.pageSize,
              search1,
              search2
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

  navigateToLibraryCreate() {
    this.router.navigate([
      '/library-configurations/library-configuration-create',
    ]);
  }

  openDeleteDialog(library: LibraryConfiguration) {
    const dialogRef = this.dialog.open(MessageComponent, {
      data: 'Deseja mesmo excluir essa configuração?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.libraryService
          .delete(library.id)
          .pipe(
            catchError((err) => {
              this.messageService.error('Configuração não pode ser excluida!');
              return err;
            })
          )
          .subscribe(() => {
            this.paginator.firstPage();
            this.refresh.next(true);
            this.messageService.success('Configuração excluída com sucesso!');
          });
      }
    });
  }
}
