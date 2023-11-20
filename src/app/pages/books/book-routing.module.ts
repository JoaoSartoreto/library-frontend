import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksListComponent } from './books-list/books-list.component';
import { BookInfoComponent } from './book-info/book-info.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { LibrarianGuard } from 'src/app/guards/librarian.guard';

const routes: Routes = [
  { path: '', component: BooksListComponent },
  { path: 'book-info/:id', component: BookInfoComponent },
  {
    path: 'book-create',
    component: BookCreateComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: ':id/edit',
    component: BookEditComponent,
    canActivate: [LibrarianGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookRoutingModule {}
