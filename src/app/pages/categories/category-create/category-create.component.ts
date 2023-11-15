import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss'],
})
export class CategoryCreateComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: CategoriesService,
    private readonly messageService: MessagesService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  salvar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const name = this.form.get('name')?.value;

      const sub = this.categoriesService
        .create(name)
        .pipe(
          catchError((err) => {
            this.messageService.error('Categoria não pode ser cadastrada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Categoria cadastrada com sucesso!');
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
