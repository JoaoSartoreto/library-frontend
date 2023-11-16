import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { BibliographysService } from '../bibliographys.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';
import {
  Bibliography,
  BibliographyDto,
} from 'src/app/models/bibliography.model';

@Component({
  selector: 'app-bibliographys-create',
  templateUrl: './bibliographys-create.component.html',
  styleUrls: ['./bibliographys-create.component.scss'],
})
export class BibliographysCreateComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly bibliographysService: BibliographysService,
    private readonly messageService: MessagesService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      description: [null, [Validators.required]],
      bookId: [null, [Validators.required]],
      bookIds: this.fb.array([]),
    });
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
        .create(bibli)
        .pipe(
          catchError((err) => {
            this.messageService.error('Bibliografia não pode ser cadastrada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Bibliografia cadastrada com sucesso!');
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
  addBookIdInput(): void {
    this.bookIdsFormArray.push(this.fb.control(''));
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
