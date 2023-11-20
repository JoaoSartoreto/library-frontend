import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BibliographysListComponent } from './bibliographys-list/bibliographys-list.component';
import { BibliographyInfoComponent } from './bibliography-info/bibliography-info.component';
import { BibliographyCreateComponent } from './bibliography-create/bibliography-create.component';
import { BibliographyEditComponent } from './bibliography-edit/bibliography-edit.component';
import { LibrarianGuard } from 'src/app/guards/librarian.guard';

const routes: Routes = [
  { path: '', component: BibliographysListComponent },
  { path: 'bibliography-info/:id', component: BibliographyInfoComponent },
  {
    path: 'bibliography-create',
    component: BibliographyCreateComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: ':id/edit',
    component: BibliographyEditComponent,
    canActivate: [LibrarianGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BibliographyRoutingModule {}
