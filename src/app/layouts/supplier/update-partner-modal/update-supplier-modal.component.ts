import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Suppliers } from 'src/app/modules/shared/models/suppliers';
import { SuppliersService } from 'src/app/modules/shared/services/supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-supplier-modal',
  templateUrl: './update-supplier-modal.component.html',
  styleUrls: ['./update-supplier-modal.component.css']
})
export class UpdateSuppliersModalComponent {
  @Input() Supplier!: Suppliers;
  submitted = false
  SupplierForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private SuppliersService: SuppliersService
  ) {
    this.SupplierForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(0|\+84)[0-9]{9}$/)  // Pattern để kiểm tra số điện thoại
      ]],
      region: [''],
      CreatedDate: [''],
      address: [''],
      city: [''],
      ward: [''],
      createdBy: [''],
      branch: [''],
      supplierGroup: [''],
      taxCode: [''],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.Supplier) {
      this.SupplierForm.patchValue(this.Supplier);
    }
  }

  updateSupplier(): void {
    this.submitted = true;
    if (this.SupplierForm.invalid) {
      this.showErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const updatedSuppliers: Suppliers = {
      ...this.SupplierForm.value,
      id: this.Supplier?.id
    };

    this.SuppliersService.updateSuppliers(updatedSuppliers).subscribe(
      () => {
        this.SuppliersService.setSelectedSuppliers(updatedSuppliers);
        this.showSuccessMessage('Cập nhật thành công');
        this.activeModal.close('Updated');
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

  get f() { return this.SupplierForm.controls; }
}
