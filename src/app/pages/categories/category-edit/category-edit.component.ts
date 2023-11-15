import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
})
export class CategoryEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  category!: Category;

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: CategoriesService,
    private readonly messageService: MessagesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
    });

    const sub = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.categoriesService.findById(id).subscribe((category) => {
        this.category = category;

        this.form.patchValue({
          name: this.category.name,
        });
      });

      this.subscription.push(sub);
    });

    this.subscription.push(sub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  salvar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.category.name = this.form.get('name')?.value;

      const sub = this.categoriesService
        .update(this.category)
        .pipe(
          catchError((err) => {
            this.messageService.error('Categoria não pode ser atualizada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Categoria atualizada com sucesso!');
          this.router.navigate(['/categories']);
        });

      this.subscription.push(sub);
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  cancelar() {
    this.router.navigate(['/categories']);
  }
}
