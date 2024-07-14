import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Partner } from 'src/app/modules/shared/models/partner';
import { PartnerService } from 'src/app/modules/shared/services/partner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-partner-modal',
  templateUrl: './update-partner-modal.component.html',
  styleUrls: ['./update-partner-modal.component.css']
})
export class UpdatePartnerModalComponent {
  @Input() partner!: Partner;
  submitted = false
  partnerForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private partnerService: PartnerService
  ) {
    this.partnerForm = this.formBuilder.group({
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
    if (this.partner) {
      this.partnerForm.patchValue(this.partner);
    }
  }

  updatePartner(): void {
    this.submitted = true;
    if (this.partnerForm.invalid) {
      this.showErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const updatedpartner: Partner = {
      ...this.partnerForm.value,
      id: this.partner?.id
    };

    this.partnerService.updatePartner(updatedpartner).subscribe(
      () => {
        this.partnerService.setSelectedPartner(updatedpartner);
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

  get f() { return this.partnerForm.controls; }
}
