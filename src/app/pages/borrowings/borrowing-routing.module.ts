import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BorrowingsListComponent } from './borrowings-list/borrowings-list.component';
import { BorrowingCreateComponent } from './borrowing-create/borrowing-create.component';
import { LibrarianGuard } from 'src/app/guards/librarian.guard';

const routes: Routes = [
  { path: '', component: BorrowingsListComponent },
  {
    path: 'borrowing-create',
    component: BorrowingCreateComponent,
    canActivate: [LibrarianGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowingRoutingModule {}
