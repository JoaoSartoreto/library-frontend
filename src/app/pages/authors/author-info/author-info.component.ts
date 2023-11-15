import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorsService } from '../authors.service';
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  merge,
} from 'rxjs';
import { Author } from 'src/app/models/author.model';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-author-info',
  templateUrl: './author-info.component.html',
  styleUrls: ['./author-info.component.scss'],
})
export class AuthorInfoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  data: Book[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['id', 'title', 'year', 'edition'];
  refresh: Subject<boolean> = new Subject();
  author: Author | null = null;

  constructor(
    private readonly router: Router,
    private readonly authorsService: AuthorsService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.authorsService.findById(id).subscribe((author) => {
        this.author = author;
        this.data = this.author.books;
        this.resultsLength = this.data.length;
      });

      this.subscriptions.push(sub);
    });

    this.subscriptions.push(sub1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  navigateToAuthorCreate() {
    this.router.navigate(['/authors/author-create']);
  }

  voltar() {
    this.router.navigate(['/authors']);
  }
}
