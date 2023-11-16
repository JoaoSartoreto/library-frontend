import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { PublishersService } from '../publishers.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';
import { PublisherDto } from 'src/app/models/publisher.model';

@Component({
  selector: 'app-publisher-create',
  templateUrl: './publisher-create.component.html',
  styleUrls: ['./publisher-create.component.scss'],
})
export class PublisherCreateComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly publishersService: PublishersService,
    private readonly messageService: MessagesService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      country: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  salvar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const name = this.form.get('name')?.value;
      const country = this.form.get('country')?.value;
      const publisher: PublisherDto = { name, country };

      const sub = this.publishersService
        .create(publisher)
        .pipe(
          catchError((err) => {
            this.messageService.error('Editora não pode ser cadastrada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Editora cadastrada com sucesso!');
          this.router.navigate(['/publishers']);
        });

      this.subscription.push(sub);
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  cancelar() {
    this.router.navigate(['/publishers']);
  }
}
