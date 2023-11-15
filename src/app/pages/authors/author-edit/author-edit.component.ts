import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { AuthorsService } from '../authors.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Author } from 'src/app/models/author.model';

@Component({
  selector: 'app-author-edit',
  templateUrl: './author-edit.component.html',
  styleUrls: ['./author-edit.component.css'],
})
export class AuthorEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  author!: Author;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authorsService: AuthorsService,
    private readonly messageService: MessagesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fullName: [null, [Validators.required]],
    });

    const sub = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.authorsService.findById(id).subscribe((author) => {
        this.author = author;

        this.form.patchValue({
          fullName: this.author.fullName,
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
      this.author.fullName = this.form.get('fullName')?.value;

      const sub = this.authorsService
        .update(this.author)
        .pipe(
          catchError((err) => {
            this.messageService.error('Autor não pode ser atualizado!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Autor atualizado com sucesso!');
          this.router.navigate(['/authors']);
        });

      this.subscription.push(sub);
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  cancelar() {
    this.router.navigate(['/authors']);
  }
}
