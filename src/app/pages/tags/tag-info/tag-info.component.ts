import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsService } from '../tags.service';
import { Subject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Book } from 'src/app/models/book.model';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-tag-info',
  templateUrl: './tag-info.component.html',
  styleUrls: ['./tag-info.component.scss'],
})
export class TagInfoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  data: Book[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['id', 'title', 'year', 'edition'];
  refresh: Subject<boolean> = new Subject();
  tag: Tag | null = null;

  constructor(
    private readonly router: Router,
    private readonly tagsService: TagsService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.tagsService.findById(id).subscribe((tag) => {
        this.tag = tag;
        this.data = this.tag.books;
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
    this.router.navigate(['/tags']);
  }
}
