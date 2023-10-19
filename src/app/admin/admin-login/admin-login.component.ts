import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  form: FormGroup;
  error: string;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.redirectToAdminConsole();
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.error = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const controls = this.form.controls;
    this.adminService.login(controls['username'].value, controls['password'].value).subscribe({
      next: (res) => {
        this.adminService.setToken(res.token);
        this.loading = false;
        this.redirectToAdminConsole();
      },
      error: error => {
        this.error = error.error.message;
        this.loading = false;
      }
    });
  }

  redirectToAdminConsole() {
    if (this.adminService.isLoggedIn()) {
      this.router.navigate(['/admin-console']);
    }
  }

  back() {
    this.router.navigate(['/']);
  }
}
