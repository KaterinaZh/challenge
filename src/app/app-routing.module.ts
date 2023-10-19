import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RowComponent} from "./row/row.component";
import {AdminLoginComponent} from "./admin/admin-login/admin-login.component";
import {AdminConsoleComponent} from "./admin/admin-console/admin-console.component";

const routes: Routes = [
  {path: 'leaderboard', component: RowComponent},
  {path: 'admin-login', component: AdminLoginComponent},
  {path: 'admin-console', component: AdminConsoleComponent},
  {path: '', redirectTo: '/leaderboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
