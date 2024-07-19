import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/modules/shared/services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-account-modal',
  templateUrl: './update-account-modal.component.html',
  styleUrls: ['./update-account-modal.component.css']
})
export class UpdateAccountModalComponent implements OnInit {
  @Input() account: any; // Receive account data from modalRef
  updateAccountForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private accountService: AccountService
  ) {
    // Initialize FormGroup with FormBuilder and Validators
    this.updateAccountForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    // Display account information in form when modal opens
    if (this.account) {
      this.updateAccountForm.patchValue({
        firstname: this.account.firstname,
        lastname: this.account.lastname,
        phone: this.account.phone,
        email: this.account.email,
        password: '' // Initially set to empty string
      });
    }
  }

  // Method to update account
  updateAccount(): void {
    if (this.updateAccountForm.invalid) {
      Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin.', 'error');
      return;
    }

    // Get values from form
    const { firstname, lastname, phone, email, password, confirmPassword } = this.updateAccountForm.value;

    // Create update data object
    const accountData: any = {
      id: this.account.id,
      firstname,
      lastname,
      phone,
      email
    };

    // Only include password if it's not an empty string and if it matches confirmPassword
    if (password) {
      if (password !== confirmPassword) {
        Swal.fire('Lỗi', 'Mật khẩu và mật khẩu xác nhận không khớp', 'error');
        return;
      }
      accountData.password = password;
    }

    // Call update account service
    this.accountService.updateAccount(this.account.id, accountData).subscribe(
      () => {
        Swal.fire('Cập nhật tài khoản thành công!', '', 'success');
        this.activeModal.close('success');
      },
      (error) => {
        Swal.fire('Lỗi', 'Đã xảy ra lỗi khi cập nhật tài khoản: ' + error.message, 'error');
      }
    );
  }

  // Method to close modal
  closeModal(): void {
    this.activeModal.dismiss('cancel'); // Dismiss modal with 'cancel' reason
  }
}
