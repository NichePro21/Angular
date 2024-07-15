import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { bootstrap } from 'bootstrap'; // Import the 'bootstrap' library

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
    // Close the modal (if using Bootstrap)
    const modal = document.getElementById('editAddressModal');
    if (modal) {
      // const modalInstance = new bootstrap.Modal(modal);
      // modalInstance.hide();
    }
  }
}
