import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../books.service';
import { Subject, Subscription } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { Author } from 'src/app/models/author.model';
import { Tag } from 'src/app/models/tag.model';
import { Category } from 'src/app/models/category.model';
@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss'],
})
export class BookInfoComponent implements OnInit, OnDestroy {
  data1: Author[] = [];
  data2: Tag[] = [];
  data3: Category[] = [];
  resultsLength1: number = 0;
  resultsLength2: number = 0;
  resultsLength3: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns1: string[] = ['id', 'fullName'];
  displayedColumns2: string[] = ['id', 'name'];
  displayedColumns3: string[] = ['id', 'name'];
  refresh: Subject<boolean> = new Subject();
  book: Book | null = null;

  constructor(
    private readonly router: Router,
    private readonly booksService: BooksService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.booksService.findById(id).subscribe((book) => {
        this.book = book;
        this.data1 = this.book.authors;
        this.data2 = this.book.tags;
        this.data3 = this.book.categories;
        this.resultsLength1 = this.data1.length;
        this.resultsLength2 = this.data2.length;
        this.resultsLength3 = this.data3.length;
      });

      this.subscriptions.push(sub);
    });

    this.subscriptions.push(sub1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  voltar() {
    this.router.navigate(['/books']);
  }
}
