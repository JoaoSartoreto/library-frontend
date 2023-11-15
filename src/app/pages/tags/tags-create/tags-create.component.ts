import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { TagsService } from '../../tags.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags-create',
  templateUrl: './tags-create.component.html',
  styleUrls: ['./tags-create.component.scss'],
})
export class TagsCreateComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly tagsService: TagsService,
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

      const sub = this.tagsService
        .create(name)
        .pipe(
          catchError((err) => {
            this.messageService.error('Tag não pode ser cadastrada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Tag cadastrada com sucesso!');
          this.router.navigate(['/tags']);
        });

      this.subscription.push(sub);
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  cancelar() {
    this.router.navigate(['/tags']);
  }
}
