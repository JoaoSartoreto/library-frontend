import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { MessagesService } from 'src/app/message/messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscription: Subscription[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly messagesService: MessagesService
  ) {}
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  entrar(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const { email, password } = this.form.value;
      const sub = this.authenticationService
        .login(email, password)
        .pipe(
          catchError((error) => {
            this.messagesService.error(error.error.message);
            return throwError(() => error);
          })
        )
        .subscribe((resp) => {
          if (resp) {
            this.router.navigate(['/']);
          } else {
            this.messagesService.error('E-mail ou senha inválidos!');
          }
        });

      this.subscription.push(sub);
    } else {
      this.messagesService.error('Há campos inválidos no formulário!');
    }
  }

  criarConta() {
    this.router.navigate(['/criar-conta']);
  }
}
