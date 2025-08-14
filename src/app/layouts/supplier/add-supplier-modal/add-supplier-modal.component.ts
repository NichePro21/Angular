import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Suppliers } from 'src/app/modules/shared/models/suppliers';
import { SuppliersService } from 'src/app/modules/shared/services/supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-supplier-modal',
  templateUrl: './add-supplier-modal.component.html',
  styleUrls: ['./add-supplier-modal.component.css']
})
export class AddSupplierModalComponent {
  SupplierForm!: FormGroup;
  submitted = false;
  newSupplier: Suppliers = {
    id: 0,
    name: '',
    phone: '',
    region: '',
    ward: '',
    email: '',
    branch: '',
    company: '',
    address: '',
    taxCode: '',
    createdBy: '',
    supplierGroup: '',
    createdDate: new Date(),
    note: ''
  };

  constructor(
    public modal: NgbActiveModal,
    private SupplierService: SuppliersService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.SupplierForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[\p{L}\s]+$/u) // Cho phép tiếng Việt
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(0|\+84)\d{9}$/)
      ]],
      region: [''],
      createdDate: [null], // Đúng tên với interface
      address: [''],
      ward: [''],
      createdBy: [''],
      branch: [''],
      supplierGroup: [''],
      taxCode: [''],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      note: [''] // Khớp với interface
    });
  }

  get f() {
    return this.SupplierForm.controls;
  }

  saveSupplier(): void {
    this.submitted = true;

    if (this.SupplierForm.invalid) {
      Swal.fire('Vui lòng nhập đầy đủ thông tin hợp lệ', '', 'error');
      return;
    }

    const newSupplier: Suppliers = this.SupplierForm.value;

    this.SupplierService.addSuppliers(newSupplier).subscribe({
      next: (result) => {
        Swal.fire('Thêm nhà cung cấp thành công', '', 'success');
        this.SupplierService.fetchSupplierss();
        this.modal.close(result);
      },
      error: (error) => {
        console.log(newSupplier);
        console.error('Error adding supplier:', error.message);
        const errorMessage = error.error?.message || 'Lỗi khi thêm nhà cung cấp';
        Swal.fire('Lỗi', errorMessage, 'error');
      }
    });

  }
  close(): void {
    this.modal.dismiss('Cancel');
  }
}
