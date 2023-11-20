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
import { Book } from 'src/app/models/book.model';

import { MessageComponent } from 'src/app/message/message.component';
import { BooksService } from '../books.service';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { MessagesService } from 'src/app/message/messages.service';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
})
export class BooksListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoadingResults: boolean = true;
  data: Book[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = [
    'isbn',
    'title',
    'language',
    'year',
    'edition',
    'quantity',
    'actions',
  ];
  form!: FormGroup;
  refresh: Subject<boolean> = new Subject();
  user: User | null = null;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly booksService: BooksService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly messageService: MessagesService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUserValue();
    this.form = this.fb.group({
      title: [],
      language: [],
      year: [],
      authorName: [],
      tagName: [],
      categoryName: [],
      publisherName: [],
    });

    const sub1 = this.form
      .get('title')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub1);

    const sub2 = this.form
      .get('language')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub2);

    const sub3 = this.form
      .get('year')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub3);

    const sub4 = this.form
      .get('authorName')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub4);

    const sub5 = this.form
      .get('tagName')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub5);

    const sub6 = this.form
      .get('categoryName')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub6);

    const sub7 = this.form
      .get('publisherName')!
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.paginator.firstPage();
        this.refresh.next(true);
      });
    this.subscriptions.push(sub7);
  }

  ngAfterViewInit(): void {
    const sub = merge(this.refresh, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const title = this.form.get('title')?.value;
          const language = this.form.get('language')?.value;
          const year = this.form.get('year')?.value;
          const authorName = this.form.get('authorName')?.value;
          const tagName = this.form.get('tagName')?.value;
          const categoryName = this.form.get('categoryName')?.value;
          const publisherName = this.form.get('publisherName')?.value;

          return this.booksService
            .list(
              this.paginator.pageIndex + 1,
              this.paginator.pageSize,
              title,
              language,
              year,
              authorName,
              tagName,
              categoryName,
              publisherName
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

  navigateToBookCreate() {
    this.router.navigate(['/books/book-create']);
  }

  openDeleteDialog(book: Book) {
    const dialogRef = this.dialog.open(MessageComponent, {
      data: 'Deseja mesmo excluir esse Livro?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.booksService
          .delete(book.id)
          .pipe(
            catchError((err) => {
              this.messageService.error('Livro não pode ser excluido!');
              return err;
            })
          )
          .subscribe(() => {
            this.paginator.firstPage();
            this.refresh.next(true);
            this.messageService.success('Livro excluído com sucesso!');
          });
      }
    });
  }

  bookInfo(book: Book) {
    this.router.navigate([`/books/book-info/${book.id}`]);
  }
}
