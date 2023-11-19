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
import { BibliographysListComponent } from './pages/bibliographys/bibliographys-list/bibliographys-list.component';
import { BibliographysInfoComponent } from './pages/bibliographys/bibliographys-info/bibliographys-info.component';
import { BibliographysCreateComponent } from './pages/bibliographys/bibliographys-create/bibliographys-create.component';
import { BibliographysEditComponent } from './pages/bibliographys/bibliographys-edit/bibliographys-edit.component';
import { PublishersListComponent } from './pages/publishers/publishers-list/publishers-list.component';
import { PublisherInfoComponent } from './pages/publishers/publisher-info/publisher-info.component';
import { PublisherCreateComponent } from './pages/publishers/publisher-create/publisher-create.component';
import { PublisherEditComponent } from './pages/publishers/publisher-edit/publisher-edit.component';
import { BooksListComponent } from './pages/books/books-list/books-list.component';
import { BookInfoComponent } from './pages/books/book-info/book-info.component';
import { BookCreateComponent } from './pages/books/book-create/book-create.component';
import { BookEditComponent } from './pages/books/book-edit/book-edit.component';
import { ReservesListComponent } from './pages/reserves/reserves-list/reserves-list.component';
import { ReserveCreateComponent } from './pages/reserves/reserve-create/reserve-create.component';
import { ReserveEditComponent } from './pages/reserves/reserve-edit/reserve-edit.component';
import { BorrowingsListComponent } from './pages/borrowings/borrowings-list/borrowings-list.component';
import { BorrowingCreateComponent } from './pages/borrowings/borrowing-create/borrowing-create.component';
import { FinesListComponent } from './pages/fines/fines-list/fines-list.component';

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
      {
        path: 'bibliographys',
        children: [
          { path: '', component: BibliographysListComponent },
          {
            path: 'bibliography-info/:id',
            component: BibliographysInfoComponent,
          },
          {
            path: 'bibliography-create',
            component: BibliographysCreateComponent,
          },
          { path: ':id/edit', component: BibliographysEditComponent },
        ],
      },
      {
        path: 'publishers',
        children: [
          { path: '', component: PublishersListComponent },
          {
            path: 'publisher-info/:id',
            component: PublisherInfoComponent,
          },
          {
            path: 'publisher-create',
            component: PublisherCreateComponent,
          },
          { path: ':id/edit', component: PublisherEditComponent },
        ],
      },
      {
        path: 'books',
        children: [
          { path: '', component: BooksListComponent },
          { path: 'book-info/:id', component: BookInfoComponent },
          { path: 'book-create', component: BookCreateComponent },
          { path: ':id/edit', component: BookEditComponent },
        ],
      },
      {
        path: 'reserves',
        children: [
          { path: '', component: ReservesListComponent },
          { path: 'reserve-create', component: ReserveCreateComponent },
          { path: ':id/edit', component: ReserveEditComponent },
        ],
      },
      {
        path: 'borrowings',
        children: [
          { path: '', component: BorrowingsListComponent },
          { path: 'borrowing-create', component: BorrowingCreateComponent },
        ],
      },
      {
        path: 'fines',
        children: [{ path: '', component: FinesListComponent }],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
