import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { TagsService } from '../tags.service';
import { MessagesService } from 'src/app/message/messages.service';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.scss'],
})
export class TagEditComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];
  tag!: Tag;

  constructor(
    private readonly fb: FormBuilder,
    private readonly tagsService: TagsService,
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

      const sub = this.tagsService.findById(id).subscribe((tag) => {
        this.tag = tag;

        this.form.patchValue({
          name: this.tag.name,
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
      this.tag.name = this.form.get('name')?.value;

      const sub = this.tagsService
        .update(this.tag)
        .pipe(
          catchError((err) => {
            this.messageService.error('Tag não pode ser atualizada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Tag atualizada com sucesso!');
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
