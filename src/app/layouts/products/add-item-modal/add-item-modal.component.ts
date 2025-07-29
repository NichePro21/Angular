import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Color } from 'src/app/modules/shared/models/properties/color';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css'] // ✅ dòng này phải đúng
})
export class AddItemModalComponent {

  activeTab = 1;
  brands: any[] = [];
  selectedBrandId: number | null = null;
  categories: any[] = [];
  selectedCateId: number | null = null;
  nextProductId: number | null = null;
  newBrandName: string = '';
  //san pham khai bao
  productName: string = '';
  productPrice: number = 0;
  capitalPrice: number = 0;
  barcode: string = '';
  stock: number = 0;
  minStock: number = 0;
  maxStock: number = 0;
  description: string = '';
  note: string = ''; // <-- Khai báo biến này để sửa lỗi
  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }
  close() {
    this.activeModal.dismiss();
  }
  imageError = '';
  capitalPriceError = '';
  priceError = '';
  productNameError = '';
  descriptionError = '';
  save() {
    // Kiểm tra bắt buộc
    // Reset tất cả lỗi
    this.imageError = '';
    this.capitalPriceError = '';
    this.priceError = '';
    this.productNameError = '';
    this.descriptionError = '';

    let isValid = true;

    // Kiểm tra tên sản phẩm
    if (!this.productName || this.productName.trim() === '') {
      this.productNameError = 'Tên sản phẩm không được để trống';
      isValid = false;
    }

    // Kiểm tra giá bán
    if (this.productPrice == null || this.productPrice <= 0) {
      this.priceError = 'Giá bán phải lớn hơn 0';
      isValid = false;
    }

    // Kiểm tra giá vốn
    if (this.capitalPrice == null || this.capitalPrice < 0) {
      this.capitalPriceError = 'Giá vốn không được âm';
      isValid = false;
    }

    // Kiểm tra mô tả
    if (!this.description || this.description.trim() === '') {
      this.descriptionError = 'Mô tả không được để trống';
      isValid = false;
    }

    // Kiểm tra ảnh
    if (!this.images || !this.images.some(i => i.file)) {
      this.imageError = 'Vui lòng chọn ít nhất 1 hình ảnh';
      isValid = false;
    }

    if (!isValid) return;


    const productRequest = {
      name: this.productName,
      price: this.productPrice,
      capitalPrice: this.capitalPrice,
      barcode: this.barcode,
      stock: this.stock,
      description: this.description,
      note: this.note,
      imageUrl: '', // server xử lý
      type: 'PRODUCT',
      brandId: this.selectedBrandId,
      categoryId: this.selectedCateId,
      colorIds: [],
      sizeIds: [],
      weightIds: [],
      minStock: this.minStock,
      maxStock: this.maxStock
    };


    const formData = new FormData();

    formData.append('product', JSON.stringify(productRequest));

    this.images.forEach(image => {
      if (image.file) {
        formData.append('images', image.file); // Trùng key 'images' như API yêu cầu
      }
    });

    this.http.post('http://localhost:8001/api/products', formData).subscribe({
      next: (res) => {
        alert('✅ Thêm sản phẩm thành công!');
        this.activeModal.close('success');
      },
      error: (err) => {
        console.error('❌ Lỗi khi thêm sản phẩm:', err);
        alert('❌ Có lỗi xảy ra khi thêm sản phẩm.');
      }
    });
  }
  // hinh anh 
  images: { file: File | null; preview: string | null }[] = Array(5).fill(null).map(() => ({
    file: null,
    preview: null
  }));

  selectedImageIndex = 0;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectImage(index: number) {
    this.selectedImageIndex = index;
    this.fileInput.nativeElement.click();
  }

  onImageChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.images.splice(index, 1, {
          file,
          preview: reader.result as string
        });

      };
      reader.readAsDataURL(file);
    }
  }
  //brands
  ngOnInit() {
    this.fetchBrands();
    this.featchCategories();
    this.getNextProductId();
    this.loadColors();

  }
  fetchBrands() {
    this.http.get<any>('http://localhost:8001/api/brands').subscribe(response => {
      this.brands = response.data;
    });
  }
  featchCategories() {
    this.http.get<any>('http://localhost:8001/api/categories').subscribe(response => {
      this.categories = response.data;
    })
  }
  getNextProductId() {
    this.http.get<any>('http://localhost:8001/api/products').subscribe(response => {
      const products = response.data;
      if (products && products.length > 0) {
        const maxId = Math.max(...products.map((p: any) => p.id));
        this.nextProductId = maxId + 1;
      } else {
        this.nextProductId = 1;
      }
    });
  }
  //add brands
  openAddBrandModal() {
    ($('#addBrandModal') as any).modal('show');
  }
  brandErrorMsg: string = '';

  addBrand() {
    const name = this.newBrandName?.trim();
    this.brandErrorMsg = ''; // reset lỗi cũ

    if (!name) {
      this.brandErrorMsg = 'Tên thương hiệu không được để trống!';
      return;
    }

    const body = { name: name };

    this.http.post<any>('http://localhost:8001/api/brands', body).subscribe({
      next: (res) => {
        const newBrand = res.data;
        this.brands.push(newBrand);
        this.selectedBrandId = newBrand.id;
        this.newBrandName = '';
        this.brandErrorMsg = '';

        ($('#addBrandModal') as any).modal('hide');
      },
      error: (err) => {
        if (err.status === 400) {
          this.brandErrorMsg = 'Tên thương hiệu đã có!';
        } else {
          this.brandErrorMsg = 'Đã xảy ra lỗi khi thêm thương hiệu!';
        }
        console.error('❌ Lỗi:', err);
      }
    });
  }
  closeBrandModel() {
    ($('#addBrandModal') as any).modal('hide');
  }


  //categories

  openAddCategoryModal() {
    ($('#addCategoryModal') as any).modal('show');
  }
  closeCategoriesModel() {
    ($('#addCategoryModal') as any).modal('hide');
  }
  newCategoryName: string = '';
  categoryErrorMsg: string = '';

  addCategory() {
    this.categoryErrorMsg = '';
    const name = this.newCategoryName?.trim();

    if (!name) {
      this.categoryErrorMsg = 'Tên nhóm không được để trống!';
      return;
    }

    const newCate = { name };

    this.http.post('http://localhost:8001/api/categories', newCate).subscribe({
      next: (res: any) => {
        console.log('Category added:', res);

        const addedCategory = res.data ?? res;  // Phòng trường hợp API trả về dạng { data: {...} }

        this.categories.push(addedCategory);
        this.selectedCateId = addedCategory.id;

        // Reset form và đóng modal
        this.newCategoryName = '';
        this.categoryErrorMsg = '';
        ($('#addCategoryModal') as any).modal('hide');
      },
      error: (err) => {
        console.error('Add category error:', err);

        if (err.status === 400) {
          this.categoryErrorMsg = 'Tên nhóm đã tồn tại!';
        } else {
          this.categoryErrorMsg = 'Có lỗi xảy ra khi thêm nhóm hàng!';
        }
      }
    });
  }
  //colors
  allColors: any[] = []; // Tất cả màu từ server
  selectedColors: any[] = []; // Màu đã chọn
  openColorPicker = false;

  loadColors() {
    this.http.get<any[]>('http://localhost:8001/api/colors').subscribe({
      next: res => this.allColors = res,
      error: err => console.error('Không thể load danh sách màu', err)
    });
  }

  isSelected(colorId: number): boolean {
    return this.selectedColors.some(c => c.id === colorId);
  }

  toggleColor(color: any) {
    const index = this.selectedColors.findIndex(c => c.id === color.id);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
  }

  removeColor(color: any) {
    this.selectedColors = this.selectedColors.filter(c => c.id !== color.id);
  }

  async addNewColor(event: any) {
    const hex = event.target.value;

    const { value: name } = await Swal.fire({
      title: "Nhập tên màu",
      input: "text",
      inputLabel: "Tên màu",
      inputPlaceholder: "Ví dụ: Xanh biển",
      inputValidator: (value) => {
        if (!value) return "Tên màu không được để trống!";
        return null;
      },
    });

    if (!name) return;

    const newColor = { name, hexCode: hex };

    this.http.post('http://localhost:8001/api/colors', newColor).subscribe({
      next: (res: any) => {
        this.allColors.push(res);
        this.selectedColors.push(res);
        this.openColorPicker = false;
      },
      error: () => {
        Swal.fire("Lỗi", "Tên màu đã tồn tại hoặc có lỗi xảy ra!", "error");
      }
    });
  }
}
