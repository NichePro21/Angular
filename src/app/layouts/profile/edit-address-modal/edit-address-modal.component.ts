import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-edit-address-modal',
  templateUrl: './edit-address-modal.component.html',
  styleUrls: ['./edit-address-modal.component.css']
})
export class EditAddressModalComponent implements OnInit {
  addressForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.addressForm = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  get f() { return this.addressForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.addressForm.invalid) {
      return;
    }

    // Handle form submission
    console.log('Address:', this.addressForm.value);

    // Close the modal
    const modalElement = document.getElementById('editAddressModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
