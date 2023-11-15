import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PageComponent } from './layout/page/page.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { HomeComponent } from './pages/home/home.component';
import { CriarContaComponent } from './pages/criar-conta/criar-conta.component';
import { AuthorsListComponent } from './pages/authors/authors-list/authors-list.component';
import { AuthorInfoComponent } from './pages/authors/author-info/author-info.component';
import { AuthorCreateComponent } from './pages/authors/author-create/author-create.component';
import { AuthorEditComponent } from './pages/authors/author-edit/author-edit.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'criar-conta', component: CriarContaComponent },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationGuard],
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'authors',
        children: [
          { path: '', component: AuthorsListComponent },
          { path: 'author-info/:id', component: AuthorInfoComponent },
          { path: 'author-create', component: AuthorCreateComponent },
          { path: ':id/edit', component: AuthorEditComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
