import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup
  submitted = false
  successMessage: string | null = null;
  errorMessage: string | null = null;
  constructor(private authGuard: AuthGuard, private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private metaService: Meta, private titleService: Title) { }
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
    this.titleService.setTitle('Login Page - Management System');

    this.metaService.addTags([
      { name: 'description', content: 'This is the Login page for Management System.' },
      { name: 'keywords', content: 'Login, sign in' },
      { property: 'og:title', content: 'Login Page' }
    ]);

    this.loginForm = this.formBuilder.group({
      emailOrUsername: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Check for success message
    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }


  }
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage = null;
    this.authService.login(this.f['emailOrUsername'].value, this.f['password'].value).subscribe({
      next: (data) => {
        localStorage.setItem('successMessageLogin', 'Welcome to the dashboard!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }
}
