import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliographyCreateComponent } from './bibliography-create/bibliography-create.component';
import { BibliographyEditComponent } from './bibliography-edit/bibliography-edit.component';
import { BibliographyInfoComponent } from './bibliography-info/bibliography-info.component';
import { BibliographysListComponent } from './bibliographys-list/bibliographys-list.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    BibliographyCreateComponent,
    BibliographyEditComponent,
    BibliographyInfoComponent,
    BibliographysListComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class BibliographysModule {}
