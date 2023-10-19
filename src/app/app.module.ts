import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { RowComponent } from './row/row.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './loader/loader.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminConsoleComponent } from './admin/admin-console/admin-console.component';

@NgModule({
  declarations: [
    AppComponent,
    RowComponent,
    LoaderComponent,
    DropdownComponent,
    AdminLoginComponent,
    AdminConsoleComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
