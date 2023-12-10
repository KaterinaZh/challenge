import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  error: string;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      telescopeLink: ['', Validators.required],
      codewarsUsername: ['', Validators.required],
    });
  }

  onSubmit() {
    this.error = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const {
      firstName: { value: firstName },
      lastName: { value: lastName },
      telescopeLink: { value: telescopeLink },
      codewarsUsername: { value: codewarsUsername },
    } = this.form.controls;

    this.userService.register({
      firstName,
      lastName,
      telescopeLink,
      codewarsUsername,
    }).subscribe({
      next: (res) => {
        this.loading = false;
      },
      error: error => {
        this.error = error?.error?.message || 'Error';
        console.log(this.error);
        this.loading = false;
      }
    })
  }

  redirectToHomePage() {
    this.router.navigate(['/']);
  }
}
