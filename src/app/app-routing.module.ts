import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChallengeComponent} from "./challenge/challenge.component";
import {AdminLoginComponent} from "./admin/admin-login/admin-login.component";
import {AdminConsoleComponent} from "./admin/admin-console/admin-console.component";
import {RegisterComponent} from './register/register.component';
import {InfoComponent} from "./info/info.component";

const routes: Routes = [
  {path: 'challenge', component: ChallengeComponent},
  {path: 'admin-login', component: AdminLoginComponent},
  {path: 'admin-console', component: AdminConsoleComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'info/:run', component: InfoComponent},
  {path: '', redirectTo: '/challenge', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
