import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { Subject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Book } from 'src/app/models/book.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss'],
})
export class CategoryInfoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  data: Book[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['id', 'title', 'year', 'edition'];
  refresh: Subject<boolean> = new Subject();
  category: Category | null = null;

  constructor(
    private readonly router: Router,
    private readonly categoriesService: CategoriesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.categoriesService.findById(id).subscribe((category) => {
        this.category = category;
        this.data = this.category.books;
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
    this.router.navigate(['/categories']);
  }
}
