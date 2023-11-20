import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryConfigurationsListComponent } from './library-configurations-list/library-configurations-list.component';
import { LibraryConfigurationEditComponent } from './library-configuration-edit/library-configuration-edit.component';
import { LibraryConfigurationCreateComponent } from './library-configuration-create/library-configuration-create.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    LibraryConfigurationsListComponent,
    LibraryConfigurationEditComponent,
    LibraryConfigurationCreateComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
})
export class LibraryConfigurationsModule {}
