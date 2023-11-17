import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { BooksService } from '../books.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Book, BookDto } from 'src/app/models/book.model';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss'],
})
export class BookEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  book!: Book;

  constructor(
    private readonly fb: FormBuilder,
    private readonly booksService: BooksService,
    private readonly messageService: MessagesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      isbn: [null, [Validators.required]],
      title: [null, [Validators.required]],
      language: [null, [Validators.required]],
      year: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      edition: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      quantity: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      authorId: [null, [Validators.required]],
      authorIds: this.fb.array([]),
      tagId: [null, [Validators.required]],
      tagIds: this.fb.array([]),
      categoryId: [null, [Validators.required]],
      categoryIds: this.fb.array([]),
      publisherId: [null, [Validators.required]],
    });

    const sub = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.booksService.findById(id).subscribe((book) => {
        this.book = book;

        this.form.patchValue({
          isbn: this.book.isbn,
          title: this.book.title,
          language: this.book.language,
          year: this.book.year,
          edition: this.book.edition,
          quantity: this.book.quantity,
          authorId: this.book.authors[0].id,
          tagId: this.book.tags[0].id,
          categoryId: this.book.categories[0].id,
          publisherId: this.book.publisher.id,
        });

        if (this.book.authors && this.book.authors.length > 0) {
          this.book.authors.slice(1).forEach((author) => {
            this.addAuthorIdInput(author.id);
          });
        }

        if (this.book.tags && this.book.tags.length > 0) {
          this.book.tags.slice(1).forEach((tag) => {
            this.addTagIdInput(tag.id);
          });
        }

        if (this.book.categories && this.book.categories.length > 0) {
          this.book.categories.slice(1).forEach((category) => {
            this.addCategoryIdInput(category.id);
          });
        }
      });

      this.subscription.push(sub);
    });

    this.subscription.push(sub);
  }

  salvar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const isbn: string = this.form.get('isbn')?.value;
      const title: string = this.form.get('title')?.value;
      const language: string = this.form.get('language')?.value;
      const year: number = +this.form.get('year')?.value;
      const edition: number = +this.form.get('edition')?.value;
      const quantity: number = +this.form.get('quantity')?.value;
      const authorId: string = this.form.get('authorId')?.value;
      const author: string[] = this.getAuthorFilledValues();
      const authorIds: string[] = [authorId, ...author];
      const tagId: string = this.form.get('tagId')?.value;
      const tag: string[] = this.getTagFilledValues();
      const tagIds: string[] = [tagId, ...tag];
      const categoryId: string = this.form.get('categoryId')?.value;
      const category: string[] = this.getCategoryFilledValues();
      const categoryIds: string[] = [categoryId, ...category];
      const publisherId: string = this.form.get('publisherId')?.value;

      const book: BookDto = {
        isbn,
        title,
        language,
        year,
        edition,
        quantity,
        authorIds,
        tagIds,
        categoryIds,
        publisherId,
      };

      const sub = this.booksService
        .update(this.book.id, book)
        .pipe(
          catchError((err) => {
            this.messageService.error('Livro não pode ser atualizado!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Livro atualizado com sucesso!');
          this.router.navigate(['/books']);
        });

      this.subscription.push(sub);
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  get authorIdsFormArray(): FormArray {
    return this.form.get('authorIds') as FormArray;
  }

  get tagIdsFormArray(): FormArray {
    return this.form.get('tagIds') as FormArray;
  }

  get categoryIdsFormArray(): FormArray {
    return this.form.get('categoryIds') as FormArray;
  }

  // Método para adicionar um novo input de ID de livro
  addAuthorIdInput(authorId: string = ''): void {
    this.authorIdsFormArray.push(this.fb.control(authorId));
  }

  addTagIdInput(tagId: string = ''): void {
    this.tagIdsFormArray.push(this.fb.control(tagId));
  }

  addCategoryIdInput(categoryId: string = ''): void {
    this.categoryIdsFormArray.push(this.fb.control(categoryId));
  }

  // Método para remover um input de ID de livro específico
  removeAuthorIdInput(index: number): void {
    this.authorIdsFormArray.removeAt(index);
  }

  removeTagIdInput(index: number): void {
    this.tagIdsFormArray.removeAt(index);
  }

  removeCategoryIdInput(index: number): void {
    this.categoryIdsFormArray.removeAt(index);
  }

  getAuthorFilledValues(): string[] {
    const filledValues: string[] = [];

    this.authorIdsFormArray.controls.forEach((control) => {
      const value = control.value;
      if (value !== null && value !== undefined && value !== '') {
        filledValues.push(value);
      }
    });

    return filledValues;
  }

  getTagFilledValues(): string[] {
    const filledValues: string[] = [];

    this.tagIdsFormArray.controls.forEach((control) => {
      const value = control.value;
      if (value !== null && value !== undefined && value !== '') {
        filledValues.push(value);
      }
    });

    return filledValues;
  }

  getCategoryFilledValues(): string[] {
    const filledValues: string[] = [];

    this.categoryIdsFormArray.controls.forEach((control) => {
      const value = control.value;
      if (value !== null && value !== undefined && value !== '') {
        filledValues.push(value);
      }
    });

    return filledValues;
  }

  cancelar() {
    this.router.navigate(['/books']);
  }
}
