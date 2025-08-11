// products.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from 'src/app/modules/shared/models/product';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component';

import Swal from 'sweetalert2';
import { ProductResponseDTO } from 'src/app/modules/shared/response/ProductResponseDTO';
import { HttpClient } from '@angular/common/http';
import { UpdateItemModalComponent } from './update-item-modal/update-item-modal.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  products: Product[] = [];
  expandedIndex: number = -1;  // Thêm dòng này để dùng trong template
  selectedProduct: Product | null = null;
  selectedVariantId: number | null = null;
  selectedVariant?: Product;
  constructor(private productService: ProductService, private modalService: NgbModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts() {
    this.productService.getAllProductParentOnly().subscribe(data => {
      this.products = data;
    });
  }

  onSelectVariant(variant: Product) {
    if (this.selectedVariantId === variant.id) {
      this.selectedVariantId = null; // click lại thì ẩn
    } else {
      this.selectedVariantId = variant.id;
    }
  }
  // loadProducts(): void {
  //   this.productService.getProducts().subscribe({
  //     next: (response) => {
  //       console.log('Response từ API:', response);
  //       if (response && response.data) {
  //         this.products = response.data;
  //       } else {
  //         console.error('Dữ liệu không tồn tại trong phản hồi API.');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
  //     }
  //   });
  // }
  selectProduct(product: Product): void {
    this.selectedProduct = product;
  }

  isModalOpen = false;


  openAddItemModal(type: string): void {
    if (type === 'product') {
      const modalRef = this.modalService.open(AddItemModalComponent, {
        size: 'xl',
        backdrop: false,
        keyboard: false,
      });

      modalRef.result.then(
        result => {
          if (result === 'saved') {
            // load lại dữ liệu nếu cần
          }
        },
        () => { }
      );

    } else if (type === 'service') {
      Swal.fire("Success", "Bạn đã chọn thêm dịch vụ", "success");

    } else if (type === 'combo') {
      Swal.fire("Success", "Bạn đã chọn thêm combo / gói", "success");

    } else {
      Swal.fire("Lỗi", "Không xác định loại", "error");
    }
  }


  closeModal() {
    this.isModalOpen = false;
  }


  openModalImport() {
    Swal.fire("Success", "Nhập File", "success");

  }
  openModalExport() {
    Swal.fire("Success", "Xuất File", "success");

  }
  activeDetailProduct: Product | null = null;

  selectProductDetail(product: Product): void {
    if (this.activeDetailProduct?.id === product.id) {
      this.activeDetailProduct = null;
    } else {
      this.activeDetailProduct = product;
    }
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      target.closest('.product-row') ||
      target.closest('.master-row') ||
      target.closest('.dropdown-menu')
    ) {
      return;
    }
    this.activeDetailProduct = null;
  }
  //filter
  productTypes = [
    { label: 'Hàng hóa', value: 'product' },
    { label: 'Dịch vụ', value: 'service' },
    { label: 'Combo - Đóng gói', value: 'combo' },
  ];

  selectedTypes: string[] = [];

  categoryGroups = [
    { name: 'Tất cả' },
    { name: 'Đồ bảo hộ lao động' },
    { name: 'Thiết bị phòng tắm' },
    { name: 'Vật liệu hoàn thiện' },
    { name: 'Vật tư cầu đường' },
    { name: 'Vật liệu thô' },
  ];

  selectedGroup: string = 'Tất cả';

  stockOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Dưới định mức tồn', value: 'below' },
    { label: 'Vượt định mức tồn', value: 'over' },
    { label: 'Còn hàng trong kho', value: 'in' },
    { label: 'Hết hàng trong kho', value: 'out' },
    { label: 'Lựa chọn khác', value: 'other' },
  ];

  selectedStock: string = 'all';

  //update item 
  showUpdateModal: boolean = false;

  openUpdateModal(product: any) {
    const modalRef = this.modalService.open(UpdateItemModalComponent, {
      size: 'xl',
      backdrop: false,
      keyboard: false,
    });
    modalRef.componentInstance.productId = product.id;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.selectedProduct = null;
  }

  handleProductUpdated(updatedProduct: any) {
    // Cập nhật danh sách sản phẩm sau khi sửa
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
    this.closeUpdateModal();
  }

}
