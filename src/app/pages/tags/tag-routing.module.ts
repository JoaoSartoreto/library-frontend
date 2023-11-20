import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsListComponent } from './tags-list/tags-list.component';
import { TagInfoComponent } from './tag-info/tag-info.component';
import { TagCreateComponent } from './tag-create/tag-create.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { LibrarianGuard } from 'src/app/guards/librarian.guard';

const routes: Routes = [
  { path: '', component: TagsListComponent },
  { path: 'tag-info/:id', component: TagInfoComponent },
  {
    path: 'tag-create',
    component: TagCreateComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: ':id/edit',
    component: TagEditComponent,
    canActivate: [LibrarianGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagRoutingModule {}
