import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/modules/shared/services/customer.service';
import Swal from 'sweetalert2';
import { Customer } from 'src/app/modules/shared/models/customer';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.css']
})
export class AddCustomerModalComponent implements OnInit {
  customerForm!: FormGroup;
  submitted = false;
  newCustomer: Customer = {
    id: '',
    name: '',
    phone: '',
    currentDebt: 0,
    totalSales: 0,
    totalSalesMinusReturns: 0,
    birthdate: new Date(),
    group: '',
    gender: 'Male',
    taxCode: '',
    email: '',
    customerType: 'Person',
    facebook: '',
    address: '',
    city: '',
    ward: '',
    createdBy: '',
    createdDate: '',
    notes: ''
  };

  constructor(
    public modal: NgbActiveModal,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(0|\+84)[0-9]{9}$/)  // Pattern để kiểm tra số điện thoại
      ]],
      birthdate: [''],
      CreatedDate: [''],
      address: [''],
      city: [''],
      ward: [''],
      gender: ['Male'],
      customerType: ['Person'],
      taxCode: [''],
      email: [''],
      facebook: [''],
      group: [''],
      notes: ['']
    });
  }

  get f() { return this.customerForm.controls; }
  saveCustomer(): void {
    this.submitted = true;
    if (this.customerForm.valid) {
      this.customerService.addCustomer(this.newCustomer).subscribe(
        (result) => {
          Swal.fire('Thêm khách hàng thành công', '', 'success');
          this.customerService.fetchCustomers();
          this.modal.close(result);
        },
        (error) => {
          console.error('Error adding customer:', error.message);
          const errorMessage = error.error.message || 'Lỗi khi thêm khách hàng';
          Swal.fire('Lỗi khi thêm khách hàng', errorMessage, 'error');
          // this.modal.dismiss(error);
        }
      );
    } else {
      Swal.fire('Vui lòng nhập đầy đủ thông tin', '', 'error');
    }
  }


  close(): void {
    this.modal.dismiss('Cancel');
  }
}
