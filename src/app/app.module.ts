import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JsonDateInterceptor } from './interceptors/json-date.interceptor';
import { JwtAuthInterceptor } from './interceptors/jwt-auth.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { PageComponent } from './layout/page/page.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NavComponent } from './layout/nav/nav.component';
import { HomeComponent } from './pages/home/home.component';
import { CriarContaComponent } from './pages/criar-conta/criar-conta.component';
import { MessageComponent } from './message/message.component';
import { AuthorsListComponent } from './pages/authors/authors-list/authors-list.component';
import { AuthorInfoComponent } from './pages/authors/author-info/author-info.component';
import { AuthorCreateComponent } from './pages/authors/author-create/author-create.component';
import { AuthorEditComponent } from './pages/authors/author-edit/author-edit.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoryEditComponent } from './pages/categories/category-edit/category-edit.component';
import { CategoryInfoComponent } from './pages/categories/category-info/category-info.component';
import { CategoryCreateComponent } from './pages/categories/category-create/category-create.component';
import { TagsListComponent } from './pages/tags/tags-list/tags-list.component';
import { TagsInfoComponent } from './pages/tags/tags-info/tags-info.component';
import { TagsCreateComponent } from './pages/tags/tags-create/tags-create.component';
import { TagsEditComponent } from './pages/tags/tags-edit/tags-edit.component';
import { BibliographysListComponent } from './pages/bibliographys/bibliographys-list/bibliographys-list.component';
import { BibliographysInfoComponent } from './pages/bibliographys/bibliographys-info/bibliographys-info.component';
import { BibliographysCreateComponent } from './pages/bibliographys/bibliographys-create/bibliographys-create.component';
import { BibliographysEditComponent } from './pages/bibliographys/bibliographys-edit/bibliographys-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageComponent,
    FooterComponent,
    HeaderComponent,
    NavComponent,
    HomeComponent,
    CriarContaComponent,
    MessageComponent,
    AuthorsListComponent,
    AuthorInfoComponent,
    AuthorEditComponent,
    AuthorCreateComponent,
    CategoriesListComponent,
    CategoryEditComponent,
    CategoryInfoComponent,
    CategoryCreateComponent,
    TagsListComponent,
    TagsInfoComponent,
    TagsCreateComponent,
    TagsEditComponent,
    BibliographysListComponent,
    BibliographysInfoComponent,
    BibliographysCreateComponent,
    BibliographysEditComponent,
  ],
  imports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JsonDateInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
