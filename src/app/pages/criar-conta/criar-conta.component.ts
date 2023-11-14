import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUser } from 'src/app/models/user.model';
import { CriarContaService } from './criar-conta.service';
import { catchError } from 'rxjs';
import { MessagesService } from 'src/app/message/messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.component.html',
  styleUrls: ['./criar-conta.component.scss'],
})
export class CriarContaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  isChecked: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly criarContaService: CriarContaService,
    private readonly messageService: MessagesService,
    private readonly router: Router
  ) {}

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

      this.criarContaService
        .create(user)
        .pipe(
          catchError((err) => {
            this.messageService.error('Usuário não pode ser cadastrada!');
            return err;
          })
        )
        .subscribe((resp) => {
          this.messageService.success('Usuário cadastrada com sucesso!');
          this.router.navigate(['/login']);
        });
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  cancelar() {
    this.router.navigate(['/login']);
  }
}
