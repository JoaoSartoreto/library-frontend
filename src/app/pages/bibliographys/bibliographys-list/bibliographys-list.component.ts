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

import { MessageComponent } from 'src/app/message/message.component';
import { BibliographysService } from '../bibliographys.service';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Bibliography } from 'src/app/models/bibliography.model';

@Component({
  selector: 'app-bibliographys-list',
  templateUrl: './bibliographys-list.component.html',
  styleUrls: ['./bibliographys-list.component.scss'],
})
export class BibliographysListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoadingResults: boolean = true;
  data: Bibliography[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['description', 'actions'];
  form!: FormGroup;
  refresh: Subject<boolean> = new Subject();
  user: User | null = null;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly bibliographysService: BibliographysService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    this.form = this.fb.group({
      search: [],
    });

    const sub = this.form
      .get('search')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub);
  }

  ngAfterViewInit(): void {
    const sub = merge(this.refresh, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const search = this.form.get('search')?.value;
          return this.bibliographysService
            .list(this.paginator.pageIndex + 1, this.paginator.pageSize, search)
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

  navigateToBibliographyCreate() {
    this.router.navigate(['/bibliographys/bibliography-create']);
  }

  openDeleteDialog(bibliography: Bibliography) {
    const dialogRef = this.dialog.open(MessageComponent, {
      data: 'Deseja mesmo excluir essa bibliografia?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bibliographysService
          .delete(bibliography.id)
          .pipe(
            catchError((err) => {
              this.messageService.error('Bibliografia não pode ser excluida!');
              return err;
            })
          )
          .subscribe(() => {
            this.paginator.firstPage();
            this.refresh.next(true);
            this.messageService.success('Bibliografia excluída com sucesso!');
          });
      }
    });
  }

  bibliographyInfo(bibliography: Bibliography) {
    this.router.navigate([
      `/bibliographys/bibliography-info/${bibliography.id}`,
    ]);
  }
}
