import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Suppliers } from 'src/app/modules/shared/models/suppliers';
import { SuppliersService } from 'src/app/modules/shared/services/supplier.service';
import Swal from 'sweetalert2';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
import { UpdateSuppliersModalComponent } from './update-partner-modal/update-supplier-modal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SupplierComponent implements OnInit {
  searchText: string = '';
  Suppliers: Suppliers[] = [];
  selectedSupplier: Suppliers | null = null;
  supplierHistory: any[] = [];
  supplierDebtList: any[] = [];
  displayColumns = {
    id: true,
    name: true,
    phone: true,
    email: true,
    currentDebt: true,
    totalPurchases: true
  };
  historyColumns: string[] = ['code', 'time', 'creator', 'total', 'status'];
  debtColumns: string[] = ['code', 'time', 'type', 'amount', 'remainingDebt'];

  historyList = [
    { code: 'PN001', time: new Date(), creator: 'Nguyễn Văn A', total: 1500000, status: 'Hoàn tất' },
    { code: 'PX002', time: new Date(), creator: 'Trần Thị B', total: 200000, status: 'Đang xử lý' }
  ];

  debtList = [
    { code: 'PN001', time: new Date(), type: 'Nhập hàng', amount: 1500000, remainingDebt: 500000 },
    { code: 'PX002', time: new Date(), type: 'Trả hàng', amount: -200000, remainingDebt: 300000 }
  ];
  modalRef: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private SuppliersService: SuppliersService,
    private http: HttpClient
  ) { }

  filteredSuppliers: Suppliers[] = [];

  ngOnInit(): void {
    this.SuppliersService.Supplierss$.subscribe(Supplierss => {
      this.Suppliers = Supplierss;
      this.applyFilter(); // Cập nhật filteredSuppliers mỗi khi data thay đổi
    });
  }

  toggleSupplier(supplier: any) {
    if (this.selectedSupplier?.id === supplier.id) {
      this.selectedSupplier = null;
    } else {
      this.selectedSupplier = supplier;

      // Gọi API lấy lịch sử nhập/trả
      this.http.get(`/api/suppliers/${supplier.id}/history`)
        .subscribe((res: any) => this.supplierHistory = res.data);

      // Gọi API lấy nợ cần trả NCC
      this.http.get(`/api/suppliers/${supplier.id}/debt`)
        .subscribe((res: any) => this.supplierDebtList = res.data);
    }
  }

  applyFilter() {
    const search = this.searchText.trim().toLowerCase();
    this.filteredSuppliers = this.Suppliers.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.phone.toLowerCase().includes(search) ||
      s.email.toLowerCase().includes(search)
    );
  }

  selectSupplier(Suppliers: Suppliers): void {
    if (this.selectedSupplier && this.selectedSupplier.id === Suppliers.id) {
      this.selectedSupplier = null;
    } else {
      this.selectedSupplier = Suppliers;
    }
  }

  openAddSupplierModal(): void {
    const modalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: true,
      size: 'lg'
    };

    this.modalRef = this.modalService.open(AddSupplierModalComponent, modalOptions);
    this.modalRef.result.then((result) => {
      if (result) {
        this.SuppliersService.fetchSupplierss(); // Cập nhật lại danh sách đối tác sau khi thêm mới
      }
    }, (reason) => {
      console.log(`Modal dismissed with reason: ${reason}`);
    });
  }

  openUpdateSupplierModal(SuppliersId: any): void {
    this.SuppliersService.getSuppliersById(SuppliersId).subscribe(
      (Suppliers: Suppliers) => {
        const modalOptions: NgbModalOptions = {
          backdrop: false,
          keyboard: true,
          size: 'lg'
        };

        this.modalRef = this.modalService.open(UpdateSuppliersModalComponent, modalOptions);
        this.modalRef.componentInstance.Suppliers = Suppliers; // Thêm dữ liệu đối tác vào modal
        this.modalRef.result.then((result) => {
          if (result) {
            this.SuppliersService.fetchSupplierss(); // Cập nhật lại danh sách đối tác sau khi cập nhật
          }
        }, (reason) => {
          console.log(`Modal dismissed with reason: ${reason}`);
        });
      },
      (error) => {
        console.error('Error fetching Suppliers details:', error);
      }
    );
  }

  deleteSupplier(): void {
    if (this.selectedSupplier) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa đối tác này?',
        text: 'Thao tác này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.SuppliersService.deleteSuppliers(this.selectedSupplier!.id).subscribe(
            () => {
              Swal.fire('Đã xóa!', 'Đối tác đã được xóa.', 'success');
              this.SuppliersService.fetchSupplierss();
            },
            () => {
              Swal.fire('Xóa thất bại!', 'Không thể xóa đối tác. Vui lòng thử lại.', 'error');
              this.selectedSupplier = null;
            }
          );
        }
      });
    }
  }
}
