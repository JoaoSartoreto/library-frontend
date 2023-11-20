import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryConfigurationsListComponent } from './library-configurations-list/library-configurations-list.component';
import { LibraryConfigurationCreateComponent } from './library-configuration-create/library-configuration-create.component';
import { LibraryConfigurationEditComponent } from './library-configuration-edit/library-configuration-edit.component';

const routes: Routes = [
  { path: '', component: LibraryConfigurationsListComponent },
  {
    path: 'library-configuration-create',
    component: LibraryConfigurationCreateComponent,
  },
  { path: ':id/edit', component: LibraryConfigurationEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryConfigurationRoutingModule {}
