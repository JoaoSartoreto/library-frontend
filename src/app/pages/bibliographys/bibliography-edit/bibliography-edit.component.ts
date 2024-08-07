import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { BibliographysService } from '../bibliographys.service';
import { MessagesService } from 'src/app/message/messages.service';
import {
  Bibliography,
  BibliographyDto,
} from 'src/app/models/bibliography.model';

@Component({
  selector: 'app-bibliography-edit',
  templateUrl: './bibliography-edit.component.html',
  styleUrls: ['./bibliography-edit.component.scss'],
})
export class BibliographyEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  bibliography!: Bibliography;

  constructor(
    private readonly fb: FormBuilder,
    private readonly bibliographysService: BibliographysService,
    private readonly messageService: MessagesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      description: [null, [Validators.required]],
      bookId: [null, [Validators.required]],
      bookIds: this.fb.array([]),
    });

    const sub = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.bibliographysService
        .findById(id)
        .subscribe((bibliography) => {
          this.bibliography = bibliography;

          this.form.patchValue({
            description: this.bibliography.description,
            bookId: this.bibliography.books[0].id,
          });

          if (this.bibliography.books && this.bibliography.books.length > 0) {
            this.bibliography.books.slice(1).forEach((book) => {
              this.addBookIdInput(book.id);
            });
          }
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
      const description: string = this.form.get('description')?.value;
      const bookId: string = this.form.get('bookId')?.value;
      const book: string[] = this.getFilledValues();

      const bookIds: string[] = [bookId, ...book];

      const bibli: BibliographyDto = { description, bookIds };

      const sub = this.bibliographysService
        .update(this.bibliography.id, bibli)
        .pipe(
          catchError((err) => {
            this.messageService.error('Bibliografia não pode ser atualizada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Bibliografia atualizado com sucesso!');
          this.router.navigate(['/bibliographys']);
        });

      this.subscription.push(sub);
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  get bookIdsFormArray(): FormArray {
    return this.form.get('bookIds') as FormArray;
  }

  // Método para adicionar um novo input de ID de livro
  addBookIdInput(bookId: string = ''): void {
    this.bookIdsFormArray.push(this.fb.control(bookId));
  }

  // Método para remover um input de ID de livro específico
  removeBookIdInput(index: number): void {
    this.bookIdsFormArray.removeAt(index);
  }

  getFilledValues(): string[] {
    const filledValues: string[] = [];

    this.bookIdsFormArray.controls.forEach((control) => {
      const value = control.value;
      if (value !== null && value !== undefined && value !== '') {
        filledValues.push(value);
      }
    });

    return filledValues;
  }

  cancelar() {
    this.router.navigate(['/bibliographys']);
  }
}
