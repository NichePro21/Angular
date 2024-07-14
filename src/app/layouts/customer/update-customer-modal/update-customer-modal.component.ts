import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/modules/shared/models/customer';
import { CustomerService } from 'src/app/modules/shared/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-customer-modal',
  templateUrl: './update-customer-modal.component.html',
  styleUrls: ['./update-customer-modal.component.css']
})
export class UpdateCustomerModalComponent {
  @Input() customer!: Customer;
  submitted = false
  customerForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private customerService: CustomerService
  ) {
    this.customerForm = this.formBuilder.group({
      id: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(0|\+84)[0-9]{9}$/)
      ]],
      birthdate: [''],
      address: [''],
      city: [''],
      ward: [''],
      gender: [''],
      customerType: [''],
      taxCode: [''],
      email: [''],
      facebook: [''],
      group: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.customer) {
      this.customerForm.patchValue(this.customer);
    }
  }

  updateCustomer(): void {
    this.submitted = true;
    if (this.customerForm.invalid) {
      this.showErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const updatedCustomer: Customer = {
      ...this.customerForm.value,
      id: this.customer?.id
    };

    this.customerService.updateCustomer(updatedCustomer).subscribe(
      () => {
        this.customerService.setSelectedCustomer(updatedCustomer); // Cập nhật khách hàng được chọn
        this.showSuccessMessage('Cập nhật thành công');
        this.activeModal.close('Updated'); // Đóng modal khi cập nhật thành công
      },
      () => this.showErrorMessage('Cập nhật thất bại. Vui lòng thử lại.')
    );
  }

  showErrorMessage(message: string): void {
    Swal.fire(message, '', 'error');
  }
  showSuccessMessage(message: string): void {
    Swal.fire(message, '', 'success');
  }

  close(): void {
    this.activeModal.dismiss('closed');
  }

  get f() { return this.customerForm.controls; }
}
