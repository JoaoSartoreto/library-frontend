import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservesListComponent } from './reserves-list/reserves-list.component';
import { ReserveCreateComponent } from './reserve-create/reserve-create.component';
import { ReserveEditComponent } from './reserve-edit/reserve-edit.component';

const routes: Routes = [
  { path: '', component: ReservesListComponent },
  { path: 'reserve-create', component: ReserveCreateComponent },
  { path: ':id/edit', component: ReserveEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserveRoutingModule {}
