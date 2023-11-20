import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryInfoComponent } from './category-info/category-info.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';

const routes: Routes = [
  { path: '', component: CategoriesListComponent },
  { path: 'category-info/:id', component: CategoryInfoComponent },
  { path: 'category-create', component: CategoryCreateComponent },
  { path: ':id/edit', component: CategoryEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
