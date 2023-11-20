import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BibliographysService } from '../bibliographys.service';
import { Subject, Subscription } from 'rxjs';
import { Bibliography } from 'src/app/models/bibliography.model';
import { MatPaginator } from '@angular/material/paginator';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-bibliography-info',
  templateUrl: './bibliography-info.component.html',
  styleUrls: ['./bibliography-info.component.scss'],
})
export class BibliographyInfoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  data: Book[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['id', 'title', 'year', 'edition'];
  refresh: Subject<boolean> = new Subject();
  bibliography: Bibliography | null = null;

  constructor(
    private readonly router: Router,
    private readonly bibliographysService: BibliographysService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.bibliographysService
        .findById(id)
        .subscribe((bibliography) => {
          this.bibliography = bibliography;
          this.data = this.bibliography.books;
          this.resultsLength = this.data.length;
        });

      this.subscriptions.push(sub);
    });

    this.subscriptions.push(sub1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  voltar() {
    this.router.navigate(['/bibliographys']);
  }
}
