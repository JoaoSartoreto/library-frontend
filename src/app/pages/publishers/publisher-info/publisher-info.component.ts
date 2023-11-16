import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublishersService } from '../publishers.service';
import { Subject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Book } from 'src/app/models/book.model';
import { Publisher } from 'src/app/models/publisher.model';

@Component({
  selector: 'app-publisher-info',
  templateUrl: './publisher-info.component.html',
  styleUrls: ['./publisher-info.component.scss'],
})
export class PublisherInfoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  data: Book[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['id', 'title', 'year', 'edition'];
  refresh: Subject<boolean> = new Subject();
  publisher: Publisher | null = null;

  constructor(
    private readonly router: Router,
    private readonly publishersService: PublishersService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.publishersService.findById(id).subscribe((publisher) => {
        this.publisher = publisher;
        this.data = this.publisher.books;
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
    this.router.navigate(['/publishers']);
  }
}
