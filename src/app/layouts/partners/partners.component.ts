import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddPartnerModalComponent } from './add-partner-modal/add-partner-modal.component';
import { Partner } from 'src/app/modules/shared/models/partner';
import { PartnerService } from 'src/app/modules/shared/services/partner.service';
import { UpdatePartnerModalComponent } from './update-partner-modal/update-partner-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  searchText: string = '';
  partners: Partner[] = [];
  selectedPartner: Partner | null = null;
  displayColumns = {
    id: true,
    name: true,
    phone: true,
    email: true,
    currentDebt: true,
    totalPurchases: true
  };

  modalRef: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private partnerService: PartnerService
  ) { }

  ngOnInit(): void {
    this.partnerService.partners$.subscribe(partners => {
      this.partners = partners; // Cập nhật danh sách đối tác từ BehaviorSubject
    });
  }

  selectPartner(partner: Partner): void {
    if (this.selectedPartner && this.selectedPartner.id === partner.id) {
      this.selectedPartner = null;
    } else {
      this.selectedPartner = partner;
    }
  }

  openAddPartnerModal(): void {
    const modalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: true,
      size: 'lg'
    };

    this.modalRef = this.modalService.open(AddPartnerModalComponent, modalOptions);
    this.modalRef.result.then((result) => {
      if (result) {
        this.partnerService.fetchPartners(); // Cập nhật lại danh sách đối tác sau khi thêm mới
      }
    }, (reason) => {
      console.log(`Modal dismissed with reason: ${reason}`);
    });
  }

  openUpdatePartnerModal(partnerId: any): void {
    this.partnerService.getPartnerById(partnerId).subscribe(
      (partner: Partner) => {
        const modalOptions: NgbModalOptions = {
          backdrop: false,
          keyboard: true,
          size: 'lg'
        };

        this.modalRef = this.modalService.open(UpdatePartnerModalComponent, modalOptions);
        this.modalRef.componentInstance.partner = partner; // Thêm dữ liệu đối tác vào modal
        this.modalRef.result.then((result) => {
          if (result) {
            this.partnerService.fetchPartners(); // Cập nhật lại danh sách đối tác sau khi cập nhật
          }
        }, (reason) => {
          console.log(`Modal dismissed with reason: ${reason}`);
        });
      },
      (error) => {
        console.error('Error fetching partner details:', error);
      }
    );
  }

  deletePartner(): void {
    if (this.selectedPartner) {
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
          this.partnerService.deletePartner(this.selectedPartner!.id).subscribe(
            () => {
              Swal.fire('Đã xóa!', 'Đối tác đã được xóa.', 'success');
              this.partnerService.fetchPartners();
            },
            () => {
              Swal.fire('Xóa thất bại!', 'Không thể xóa đối tác. Vui lòng thử lại.', 'error');
              this.selectedPartner = null;
            }
          );
        }
      });
    }
  }
}
