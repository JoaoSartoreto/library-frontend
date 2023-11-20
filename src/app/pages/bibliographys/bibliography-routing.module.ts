import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BibliographysListComponent } from './bibliographys-list/bibliographys-list.component';
import { BibliographyInfoComponent } from './bibliography-info/bibliography-info.component';
import { BibliographyCreateComponent } from './bibliography-create/bibliography-create.component';
import { BibliographyEditComponent } from './bibliography-edit/bibliography-edit.component';

const routes: Routes = [
  { path: '', component: BibliographysListComponent },
  { path: 'bibliography-info/:id', component: BibliographyInfoComponent },
  { path: 'bibliography-create', component: BibliographyCreateComponent },
  { path: ':id/edit', component: BibliographyEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BibliographyRoutingModule {}
