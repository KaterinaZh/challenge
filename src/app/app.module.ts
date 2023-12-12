import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ChallengeComponent} from './challenge/challenge.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoaderComponent} from './loader/loader.component';
import {AdminLoginComponent} from './admin/admin-login/admin-login.component';
import {AdminConsoleComponent} from './admin/admin-console/admin-console.component';
import {AddRunModalComponent} from './admin/add-run-modal/add-run-modal.component';
import {AuthInterceptor} from "./http-interceptors/auth-interceptor";
import {DeleteModalComponent} from "./admin/delete-modal/delete-modal.component";
import {EditRunModalComponent} from "./admin/edit-run-modal/edit-run-modal.component";
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    ChallengeComponent,
    LoaderComponent,
    AdminLoginComponent,
    AdminConsoleComponent,
    AddRunModalComponent,
    EditRunModalComponent,
    DeleteModalComponent,
    RegisterComponent
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
  providers: [NgbActiveModal, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
