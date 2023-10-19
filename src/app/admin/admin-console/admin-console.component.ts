import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss']
})
export class AdminConsoleComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.redirectToAdminLogin();
  }

  redirectToAdminLogin() {
    if (!this.adminService.isLoggedIn()) {
      this.router.navigate(['/admin-login']);
    }
  }

  logout() {
    this.adminService.logout();
    this.redirectToAdminLogin();
  }

  back() {
    this.router.navigate(['/']);
  }
}
