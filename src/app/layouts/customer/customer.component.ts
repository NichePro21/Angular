import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddCustomerModalComponent } from './add-customer-modal/add-customer-modal.component';
import { Customer } from 'src/app/modules/shared/models/customer';
import { CustomerService } from 'src/app/modules/shared/services/customer.service';
import { UpdateCustomerModalComponent } from './update-customer-modal/update-customer-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: [
    './customer.component.css',
    '../../../assets/plugins/jsgrid/jsgrid-theme.min.css',
    '../../../assets/plugins/jsgrid/jsgrid.min.css'
  ]
})
export class CustomerComponent implements OnInit {
  searchText: string = '';
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  displayColumns = {
    id: true,
    name: true,
    phone: true,
    currentDebt: true,
    totalSales: true,
    totalSalesMinusReturns: true
  };

  modalRef: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customerService.customers$.subscribe(customers => {
      this.customers = customers; // Cập nhật danh sách khách hàng từ BehaviorSubject
    });
    this.customerService.selectedCustomer$.subscribe(customer => {
      this.selectedCustomer = customer; // Cập nhật khách hàng được chọn từ BehaviorSubject
    });
  }

  selectCustomer(customer: Customer): void {
    if (this.selectedCustomer && this.selectedCustomer.id === customer.id) {
      this.selectedCustomer = null;
    } else {
      this.selectedCustomer = customer;
    }
  }

  importFile(): void {
    // Logic để nhập file
  }

  exportFile(): void {
    // Logic để xuất file
  }

  openAddCustomerModal(): void {
    const modalOptions: NgbModalOptions = {
      backdrop: false, // Không cho phép đóng modal khi nhấn ra ngoài
      keyboard: true, // Không cho phép đóng modal khi nhấn Esc
      size: 'xl' //
    };

    this.modalRef = this.modalService.open(AddCustomerModalComponent, modalOptions);
    this.modalRef.result.then((result) => {
      if (result) {
        // Không cần phải thêm vào danh sách tại đây do đã được cập nhật qua BehaviorSubject
      }
    }, (reason) => {
      console.log(`Modal dismissed with reason: ${reason}`);
    });
  }

  toggleDisplay(column: keyof typeof this.displayColumns): void {
    this.displayColumns[column] = !this.displayColumns[column];
  }

  openUpdateCustomerModal(customerId: any): void {
    this.customerService.getCustomerById(customerId).subscribe(
      (customer: Customer) => {
        const modalOptions: NgbModalOptions = {
          backdrop: false,
          keyboard: true,
          size: 'xl'
        };

        this.modalRef = this.modalService.open(UpdateCustomerModalComponent, modalOptions);
        this.modalRef.componentInstance.customer = customer; // Pass customer data to modal
        this.modalRef.result.then((result) => {
          if (result) {
            // Không cần phải cập nhật lại danh sách tại đây do đã được cập nhật qua BehaviorSubject
          }
        }, (reason) => {
          console.log(`Modal dismissed with reason: ${reason}`);
        });
      },
      (error) => {
        console.error('Error fetching customer details:', error);
      }
    );
  }

  deleteCustomer(): void {
    if (this.selectedCustomer) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa khách hàng này?',
        text: 'Thao tác này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.customerService.deleteCustomer(this.selectedCustomer!.id).subscribe(
            () => {
              Swal.fire('Đã xóa!', 'Khách hàng đã được xóa.', 'success');
              this.selectedCustomer = null; // Xóa khách hàng được chọn sau khi xóa thành công
            },
            () => {
              Swal.fire('Xóa thất bại!', 'Không thể xóa khách hàng. Vui lòng thử lại.', 'error');
              this.selectedCustomer = null; // Xóa khách hàng được chọn sau khi xóa thất bại
            }
          );
        }
      });
    }
  }
}
