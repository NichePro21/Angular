import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Partner } from 'src/app/modules/shared/models/partner';
import { PartnerService } from 'src/app/modules/shared/services/partner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-partner-modal',
  templateUrl: './add-partner-modal.component.html',
  styleUrls: ['./add-partner-modal.component.css']
})
export class AddPartnerModalComponent {
  partnerForm!: FormGroup;
  submitted = false;
  newPartner: Partner = {
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
    private partnerService: PartnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.partnerForm = this.fb.group({
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

  get f() { return this.partnerForm.controls; }
  savePartner(): void {
    this.submitted = true;
    if (this.partnerForm.valid) {
      this.partnerService.addPartner(this.newPartner).subscribe(
        (result) => {
          Swal.fire('Thêm khách hàng thành công', '', 'success');
          this.partnerService.fetchPartners();
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
