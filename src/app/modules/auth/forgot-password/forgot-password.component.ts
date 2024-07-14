import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private metaService: Meta, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Forgot Password - Management System');

    this.metaService.addTags([
      { name: 'description', content: 'Forgot Password' },
      { name: 'keywords', content: 'Forgot Password' },
      { property: 'og:title', content: 'Forgot Password' }
    ]);

    this.forgotPasswordForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.errorMessage = null;
    this.successMessage = null;
    // Call register service
    const email = this.forgotPasswordForm.value.email;
    this.authService.forgotPassword(email).subscribe({
      next: (data) => {
        this.successMessage = 'Email quên mật khẩu đã được gửi';
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Có lỗi xảy ra khi gửi email quên mật khẩu';
      }
    });
  }
}
