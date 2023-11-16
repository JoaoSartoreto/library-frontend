import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { PublishersService } from '../publishers.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Publisher, PublisherDto } from 'src/app/models/publisher.model';

@Component({
  selector: 'app-publisher-edit',
  templateUrl: './publisher-edit.component.html',
  styleUrls: ['./publisher-edit.component.scss'],
})
export class PublisherEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  publisher!: Publisher;

  constructor(
    private readonly fb: FormBuilder,
    private readonly publishersService: PublishersService,
    private readonly messageService: MessagesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      country: [null, [Validators.required]],
    });

    const sub = this.route.params.subscribe((params: any) => {
      const id = params['id'];

      const sub = this.publishersService.findById(id).subscribe((publisher) => {
        this.publisher = publisher;

        this.form.patchValue({
          name: this.publisher.name,
          country: this.publisher.country,
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
      const name = this.form.get('name')?.value;
      const country = this.form.get('country')?.value;
      const publisher: PublisherDto = { name, country };
      const id = this.publisher.id;

      const sub = this.publishersService
        .update(id, publisher)
        .pipe(
          catchError((err) => {
            this.messageService.error('Editora não pode ser atualizada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Editora atualizada com sucesso!');
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
