import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsListComponent } from './authors-list/authors-list.component';
import { AuthorInfoComponent } from './author-info/author-info.component';
import { AuthorCreateComponent } from './author-create/author-create.component';
import { AuthorEditComponent } from './author-edit/author-edit.component';

const routes: Routes = [
  { path: '', component: AuthorsListComponent },
  { path: 'author-info/:id', component: AuthorInfoComponent },
  { path: 'author-create', component: AuthorCreateComponent },
  { path: ':id/edit', component: AuthorEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorRoutingModule {}
