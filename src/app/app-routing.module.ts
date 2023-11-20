import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/user/login/login.component';
import { PageComponent } from './layout/page/page.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { HomeComponent } from './pages/user/home/home.component';
import { CreateAccountComponent } from './pages/user/create-account/create-account.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'criar-conta', component: CreateAccountComponent },
  {
    path: '',
    component: PageComponent,
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationGuard],
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'authors',
        loadChildren: () =>
          import('./pages/authors/author-routing.module').then(
            (m) => m.AuthorRoutingModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./pages/categories/category-routing.module').then(
            (m) => m.CategoryRoutingModule
          ),
      },
      {
        path: 'tags',
        loadChildren: () =>
          import('./pages/tags/tag-routing.module').then(
            (m) => m.TagRoutingModule
          ),
      },
      {
        path: 'bibliographys',
        loadChildren: () =>
          import('./pages/bibliographys/bibliography-routing.module').then(
            (m) => m.BibliographyRoutingModule
          ),
      },
      {
        path: 'publishers',
        loadChildren: () =>
          import('./pages/publishers/publisher-routing.module').then(
            (m) => m.PublisherRoutingModule
          ),
      },
      {
        path: 'books',
        loadChildren: () =>
          import('./pages/books/book-routing.module').then(
            (m) => m.BookRoutingModule
          ),
      },
      {
        path: 'reserves',
        loadChildren: () =>
          import('./pages/reserves/reserve-routing.module').then(
            (m) => m.ReserveRoutingModule
          ),
      },
      {
        path: 'borrowings',
        loadChildren: () =>
          import('./pages/borrowings/borrowing-routing.module').then(
            (m) => m.BorrowingRoutingModule
          ),
      },
      {
        path: 'fines',
        loadChildren: () =>
          import('./pages/fines/fine-routing.module').then(
            (m) => m.FineRoutingModule
          ),
      },
      {
        path: 'library-configurations',
        loadChildren: () =>
          import(
            './pages/library-configurations/library-configuration-routing.module'
          ).then((m) => m.LibraryConfigurationRoutingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
