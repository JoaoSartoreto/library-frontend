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
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoryEditComponent } from './pages/categories/category-edit/category-edit.component';
import { CategoryInfoComponent } from './pages/categories/category-info/category-info.component';
import { CategoryCreateComponent } from './pages/categories/category-create/category-create.component';
import { TagsListComponent } from './pages/tags/tags-list/tags-list.component';
import { TagsInfoComponent } from './pages/tags/tags-info/tags-info.component';
import { TagsCreateComponent } from './pages/tags/tags-create/tags-create.component';
import { TagsEditComponent } from './pages/tags/tags-edit/tags-edit.component';

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
      {
        path: 'categories',
        children: [
          { path: '', component: CategoriesListComponent },
          { path: 'category-info/:id', component: CategoryInfoComponent },
          { path: 'category-create', component: CategoryCreateComponent },
          { path: ':id/edit', component: CategoryEditComponent },
        ],
      },
      {
        path: 'tags',
        children: [
          { path: '', component: TagsListComponent },
          { path: 'tag-info/:id', component: TagsInfoComponent },
          { path: 'tag-create', component: TagsCreateComponent },
          { path: ':id/edit', component: TagsEditComponent },
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
