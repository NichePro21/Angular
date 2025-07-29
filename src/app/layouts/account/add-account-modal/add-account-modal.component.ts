import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/modules/shared/services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.css']
})
export class AddAccountModalComponent implements OnInit {
  addAccountForm!: FormGroup;
  modalRef: NgbModalRef | undefined;

  constructor(private fb: FormBuilder, private accountService: AccountService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.addAccountForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roles: ['', Validators.required]
    });
  }

  openAddAccountModal(): void {
    if (this.addAccountForm.invalid) {
      Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin.', 'error');
      return;
    }

    const accountData = {
      firstname: this.addAccountForm.get('firstname')!.value,
      lastname: this.addAccountForm.get('lastname')!.value,
      phone: this.addAccountForm.get('phone')!.value,
      email: this.addAccountForm.get('email')!.value,
      password: this.addAccountForm.get('password')!.value,
      isVerified: true,
      verificationCode: '',
      roles: [{ id: this.addAccountForm.get('roles')!.value }],
      addresses: []
    };

    if (accountData.password !== this.addAccountForm.get('confirmPassword')!.value) {
      Swal.fire('Lỗi', 'Mật khẩu và mật khẩu xác nhận không khớp', 'error');
      return;
    }

    this.accountService.addAccount(accountData).subscribe(
      () => {
        Swal.fire('Thêm tài khoản thành công!', '', 'success');
        this.activeModal.close('success');
      },
      (error: any) => {
        Swal.fire('Lỗi', error.message || 'Đã xảy ra lỗi khi thêm tài khoản.', 'error');
      }
    );
  }

  closeModal(): void {
    this.activeModal.close('close');
  }
}
