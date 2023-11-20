import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinesListComponent } from './fines-list/fines-list.component';

const routes: Routes = [{ path: '', component: FinesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FineRoutingModule {}
