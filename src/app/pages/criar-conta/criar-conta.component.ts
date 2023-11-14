import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUser } from 'src/app/models/user.model';
import { CriarContaService } from './criar-conta.service';
import { Subscription, catchError } from 'rxjs';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.component.html',
  styleUrls: ['./criar-conta.component.scss'],
})
export class CriarContaComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  isChecked: boolean = false;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly criarContaService: CriarContaService,
    private readonly messageService: MessagesService,
    private readonly router: Router
  ) {}
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      fullName: [null, [Validators.required]],
      password: [null, [Validators.minLength(8), Validators.required]],
      confirmPassword: [null, [Validators.minLength(8), Validators.required]],
      isLibrarian: [null],
    });
  }

  salvar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const user: CreateUser = {
        email: this.form.get('email')?.value,
        fullName: this.form.get('fullName')?.value,
        password: this.form.get('password')?.value,
        passwordConfirmation: this.form.get('confirmPassword')?.value,
        isLibrarian: this.isChecked,
      };

      const sub = this.criarContaService
        .create(user)
        .pipe(
          catchError((err) => {
            this.messageService.error('Usuário não pode ser cadastrado!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Usuário cadastrado com sucesso!');
          this.router.navigate(['/login']);
        });

      this.subscription.push(sub);
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  cancelar() {
    this.router.navigate(['/login']);
  }
}
