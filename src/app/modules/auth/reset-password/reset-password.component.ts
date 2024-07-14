import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  submitted = false;
  email: string | null = null;
  code: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.code = params['code'];
    });

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  get f() { return this.resetPasswordForm.controls; }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid || !this.email || !this.code) {
      return;
    }

    const newPassword = this.resetPasswordForm.value.newPassword;

    this.authService.resetPassword(this.email, this.code, newPassword).subscribe({
      next: (data) => {
        this.successMessage = 'Mật khẩu đã được đặt lại thành công';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Có lỗi xảy ra khi đặt lại mật khẩu';
      }
    });
  }
}
