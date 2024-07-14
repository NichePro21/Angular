import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { UserService } from 'src/app/modules/shared/services/user.service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      // Thêm các trường khác nếu cần
    });
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error loading profile data', err);
      }
    });
  }

  get f() { return this.profileForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.userService.updateUserProfile(this.profileForm.value).subscribe({
      next: (data) => {
        this.successMessage = 'Profile updated successfully';
      },
      error: (err) => {
        this.errorMessage = 'Error updating profile';
        console.error('Error updating profile', err);
      }
    });
  }
}
