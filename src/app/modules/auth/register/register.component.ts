import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private metaService: Meta, private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle('Register Page - Management System');

    this.metaService.addTags([
      { name: 'description', content: 'This is the registration page for Management System.' },
      { name: 'keywords', content: 'register, sign up' },
      { property: 'og:title', content: 'Register Page' }
    ]);
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.checkPasswords });

  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('retypePassword')?.value;

    return password === confirmPassword ? null : { notSame: true };
  }
  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.errorMessage = null;
    // Call register service
    this.authService.register(this.registerForm.value).subscribe({
      next: (data) => {
        localStorage.setItem('successMessage', 'Đã đăng ký thành công');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration error';
        console.error('Registration error', err);
      }
    });
  }
}
