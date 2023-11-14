import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { HomeService } from './home.service';
import { MessagesService } from 'src/app/message/messages.service';
import { StorageService } from 'src/app/shared/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from 'src/app/message/message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User | null = null;
  form: FormGroup = new FormGroup({});
  desabilitar: boolean = true;
  subscription: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly fb: FormBuilder,
    private readonly homeService: HomeService,
    private readonly messageService: MessagesService,
    private readonly storageService: StorageService,
    private readonly dialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();
    this.form = this.fb.group({
      email: [null, [Validators.email]],
      fullName: [null],
      password: [null, [Validators.minLength(8)]],
      confirmPassword: [null, [Validators.minLength(8)]],
      currentPassword: [null, [Validators.minLength(8), Validators.required]],
      isLibrarian: [null],
    });

    this.atualizaFormulario();
  }

  alterar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.desabilitar = false;
    } else {
      this.messageService.error('Há campos inválidos no formulário!');
    }
  }

  confirmar() {
    this.desabilitar = true;
    if (this.user) {
      let userSend: User = { ...this.user };
      if (this.form.get('password')?.value) {
        userSend.password = this.form.get('password')?.value;
        userSend.passwordConfirmation = this.form.get('confirmPassword')?.value;
      } else {
        delete userSend.password;
        delete userSend.passwordConfirmation;
      }
      userSend.email = this.form.get('email')?.value;
      userSend.fullName = this.form.get('fullName')?.value;
      userSend.currentPassword = this.form.get('currentPassword')?.value;
      userSend.isLibrarian = this.form.get('isLibrarian')?.value;

      const sub = this.homeService.update(userSend).subscribe((usuario) => {
        this.messageService.success('Usuário alterado com sucesso!');
        const currentUser: User = { ...this.user, ...usuario };
        this.user = currentUser;
        this.storageService.set('currentUser', this.user);
        this.atualizaFormulario();
      });

      this.subscription.push(sub);
    }
  }

  atualizaFormulario() {
    this.form.reset();
    if (this.user?.isLibrarian)
      this.form.get('isLibrarian')?.setValue(this.user?.isLibrarian);
    this.form.patchValue({
      email: this.user?.email,
      fullName: this.user?.fullName,
    });
  }

  deletar() {
    const dialogRef = this.dialog.open(MessageComponent, {
      data: `Deseja mesmo excluir sua conta?`,
    });
    const sub = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const sub = this.homeService.delete(this.user?.id).subscribe(() => {
          this.messageService.success('Usuário excluído com sucesso!');
          this.router.navigate(['/login']);
        });

        this.subscription.push(sub);
      }
    });

    this.subscription.push(sub);
  }
}
