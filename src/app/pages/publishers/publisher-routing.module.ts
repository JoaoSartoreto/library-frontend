import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishersListComponent } from './publishers-list/publishers-list.component';
import { PublisherInfoComponent } from './publisher-info/publisher-info.component';
import { PublisherCreateComponent } from './publisher-create/publisher-create.component';
import { PublisherEditComponent } from './publisher-edit/publisher-edit.component';

const routes: Routes = [
  { path: '', component: PublishersListComponent },
  { path: 'publisher-info/:id', component: PublisherInfoComponent },
  { path: 'publisher-create', component: PublisherCreateComponent },
  { path: ':id/edit', component: PublisherEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublisherRoutingModule {}
