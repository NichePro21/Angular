import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributeValue } from 'src/app/modules/shared/models/properties/attribute-value.model';
import { Attribute } from 'src/app/modules/shared/models/properties/attribute.model';
import { AttributeWithValuesDTO, ProductVariantRequest } from 'src/app/modules/shared/models/properties/attributes.model';
import { ProductVariant } from 'src/app/modules/shared/models/properties/product-variant.model';
import { CustomAttribute, CustomAttributeValue, CustomProductVariant, CustomVariantAttributeValue } from 'src/app/modules/shared/models/properties/ProductAttribute/CustomAttributeValue';
import { ProductAttribute } from 'src/app/modules/shared/models/properties/ProductAttribute/ProductAttribute';
import { VariantAttributeValue } from 'src/app/modules/shared/models/properties/variant-attribute-value.model';
import { AttributeValueDTO } from 'src/app/modules/shared/request/att/AttributeValueDTO';
import { ProductResponseDTO, ProductVariantDTO } from 'src/app/modules/shared/response/ProductResponseDTO';

@Component({
  selector: 'app-update-item-modal',
  templateUrl: './update-item-modal.component.html',
  styleUrls: ['./update-item-modal.component.css']
})
export class UpdateItemModalComponent {
  //khai bao
  activeTab = 1;
  @Input() productId!: number;
  product?: ProductResponseDTO;
  loading = false;
  error?: string;
  //khai bao product
  id!: number;
  name!: string;
  price!: number;
  capitalPrice!: number;
  stock!: number;
  minStock!: number;
  maxStock!: number;
  description!: string;
  note!: string;
  type!: string;
  brandId!: number;
  categoryId!: number;
  variants: ProductVariantDTO[] = [];
  barcode: string = '';

  // Lưu thông báo lỗi nếu cần
  nameError?: string;
  priceError?: string;
  capitalPriceError?: string;
  stockError?: string;
  descriptionError = '';
  // khai bao brand
  newBrandName: string = '';
  brands: any[] = [];
  selectedBrandId!: number;
  //khai bao category
  categories: any[] = [];
  selectedCateId!: number;
  //khai bao attributes
  attributesFromVariants: { name: string; values: string[] }[] = [];
  // 🔹 Thêm biến này để chứa danh sách thuộc tính tách ra từ variants

  attributes: ProductAttribute[] = [];
  // ham dung
  constructor(public activeModal: NgbActiveModal, private http: HttpClient, private cd: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    if (this.productId) {
      this.getProductDetails(this.productId);
    }
    this.loadCategories();
    this.loadBrand();
    this.loadAttributeOptions();
  }
  //hinh anh product
  imageError = '';

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
  //category 
  loadCategories(): void {
    this.http.get<any>('http://localhost:8001/api/categories').subscribe({
      next: (res) => {
        this.categories = res.data;
        // Sau khi có categories thì mới load sản phẩm
        this.getProductDetails(this.productId);
      }
    });
  }
  getCategories(): void {
    this.http.get<any[]>('http://localhost:8001/api/categories')
      .subscribe({
        next: (res) => this.categories = res,
        error: (err) => console.error('Lỗi khi tải nhóm hàng', err)
      });
  }

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
  //get brand 
  loadBrand(): void {
    this.http.get<any>('http://localhost:8001/api/brands').subscribe({
      next: (res) => {
        this.brands = res.data;
        // Sau khi có categories thì mới load sản phẩm
        this.getProductDetails(this.productId);
      }
    });
  }
  getBrands(): void {
    this.http.get<any[]>('http://localhost:8001/api/brands')
      .subscribe({
        next: (res) => {
          this.brands = res;
        },
        error: (err) => {
          console.error('Lỗi khi tải danh sách thương hiệu', err);
        }
      });
  }
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
  // get product by id 
  getProductDetails(productId: number): void {
    this.http.get<any>(`http://localhost:8001/api/products/${productId}`)
      .subscribe({
        next: (res) => {
          const data = res.data;

          // Gán dữ liệu cơ bản
          this.id = data.id;
          this.name = data.name;
          this.price = data.price;
          this.capitalPrice = data.capitalPrice;
          this.stock = data.stock;
          this.minStock = data.minStock;
          this.maxStock = data.maxStock;
          this.description = data.description;
          this.note = data.note;
          this.type = data.type;

          // Brand & Category
          this.selectedCateId = data.category?.id ?? null;
          this.selectedBrandId = data.brand?.id ?? null;

          // Biến thể
          this.variants = data.variants || [];

          // Trích xuất thuộc tính từ variants
          this.attributes = [];
          data.variants?.forEach((variant: any) => {
            variant.attributeValues?.forEach((attr: any) => {
              let existingAttr = this.attributes.find(a => a.name === attr.attributeName);
              if (!existingAttr) {
                existingAttr = { name: attr.attributeName, values: [] };
                this.attributes.push(existingAttr);
              }
              if (!existingAttr.values.includes(attr.value)) {
                existingAttr.values.push(attr.value);
              }
            });
          });

          // console.log('✅ Attributes:', this.attributes);
        },
        error: (err) => {
          console.error('❌ Lỗi khi tải thông tin sản phẩm', err);
        }
      });
  }


  // ham dong
  close() {
    this.activeModal.dismiss();
  }
  //attributes
  newAttributeName: string = '';
  attributeError: string = '';
  attributeOptions: ProductAttribute[] = [];

  showAttributes = true;
  productAttributes: {
    name: string;
    values: { id?: number; value: string }[];
  }[] = [];
  getProductAttributes(productId: number): void {
    this.http.get<any>(`http://localhost:8001/api/products/${productId}`)
      .subscribe({
        next: (res) => {
          const variants: {
            attributeValues: {
              id?: number;
              value: string;
              attributeName: string;
            }[];
          }[] = res.data?.variants || [];

          const attrMap: { [key: string]: { id?: number; value: string }[] } = {};

          variants.forEach((variant) => {
            variant.attributeValues.forEach((attrVal) => {
              const attrName = attrVal.attributeName;
              if (!attrMap[attrName]) {
                attrMap[attrName] = [];
              }
              if (!attrMap[attrName].some(v => v.value === attrVal.value)) {
                attrMap[attrName].push({ id: attrVal.id, value: attrVal.value });
              }
            });
          });

          this.productAttributes = Object.keys(attrMap).map(name => ({
            name,
            values: attrMap[name]
          }));

          console.log('🎯 productAttributes:', this.productAttributes);
        },
        error: (err) => {
          console.error('❌ Lỗi khi lấy thuộc tính sản phẩm', err);
        }
      });
  }

  toggleAttributeSection() {
    this.showAttributes = !this.showAttributes;
  }

  // Thêm hàm xử lý chọn thuộc tính
  handleAttributeChange(event: Event, index: number): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === '__create_new__') {
      // Mở modal tạo mới
      this.newAttributeName = '';
      this.attributeError = '';
      ($('#createAttributeModal') as any).modal('show');
      return;
    }

    // Tìm attribute từ danh sách
    const selectedAttr = this.attributeOptions.find(attr => attr.name === selectedValue);

    if (selectedAttr) {
      this.attributes[index].id = selectedAttr.id;
      this.attributes[index].name = selectedAttr.name;
      this.attributes[index].values = [];
    }
  }

  // Thêm thuộc tính mới vào form
  addAttribute(): void {
    this.attributes.push({
      name: '',
      values: [],
      newValue: ''
    });
  }

  // Xóa thuộc tính khỏi form
  removeAttribute(index: number): void {
    this.attributes.splice(index, 1);
  }


  removeValue(attrIndex: number, valueIndex: number): void {
    this.attributes[attrIndex].values.splice(valueIndex, 1);
    this.getProductDetails(this.id);
  }
  // Lấy tất cả tổ hợp từ mảng giá trị thuộc tính
  getAllCombinations(arr: string[][]): string[][] {
    if (arr.length === 0) return [];

    return arr.reduce((acc, curr) => {
      const res: string[][] = [];
      acc.forEach(a => {
        curr.forEach(c => {
          res.push([...a, c]);
        });
      });
      return res;
    }, [[]] as string[][]);
  }

  // Hàm thêm giá trị mới vào attribute
  addValue(event: any, attrIndex: number): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    const attr = this.attributes[attrIndex];
    const value = (attr.newValue || '').trim();

    if (value && !attr.values.includes(value)) {
      attr.values.push(value);
      attr.newValue = '';
    }
  }
  // Tạo mới thuộc tính từ modal
  createNewAttribute(): void {
    const name = this.newAttributeName.trim();
    if (!name) {
      this.attributeError = 'Vui lòng nhập tên thuộc tính';
      return;
    }

    // Kiểm tra trùng
    if (this.attributeOptions.some(attr => attr.name.toLowerCase() === name.toLowerCase())) {
      this.attributeError = 'Thuộc tính này đã tồn tại';
      return;
    }

    // Thêm vào danh sách
    const newAttr: ProductAttribute = {
      id: undefined,
      name,
      values: [],
      newValue: ''
    };
    this.attributeOptions.push(newAttr);

    // Gán cho thuộc tính đang chọn
    if (this.attributes.length > 0) {
      const lastIndex = this.attributes.length - 1;
      this.attributes[lastIndex].id = undefined;
      this.attributes[lastIndex].name = name;
      this.attributes[lastIndex].values = [];
    }

    this.closeCreateAttributeModal();
  }

  // Đóng modal tạo thuộc tính
  closeCreateAttributeModal(): void {
    ($('#createAttributeModal') as any).modal('hide');
  }
  loadAttributeOptions(): void {
    this.http.get<Attribute[]>('http://localhost:8001/api/attributes')
      .subscribe({
        next: (res) => {
          this.attributeOptions = res.map(attr => ({
            id: attr.id,
            name: attr.name,
            values: [],
            newValue: ''
          }));
        },
        error: (err) => {
          console.error('❌ Lỗi khi tải attribute options', err);
        }
      });
  }
  //variants
  // Hàm lấy tên thuộc tính từ attributeId
  getAttributeName(attributeId?: number): string {
    const attr = this.attributes.find(a => a.id === attributeId);
    return attr ? attr.name : '';
  }
  getAttributeValueByName(variant: ProductVariantDTO, attrName: string): string {
    const av = variant.attributeValues.find(av => this.getAttributeName(av.attributeId) === attrName);
    return av ? av.value : '';
  }

  formatVariantAttributes(variant: ProductVariantDTO): string {
    if (!variant.attributeValues || variant.attributeValues.length === 0) {
      return '';
    }
    return variant.attributeValues.map(av => av.value).join(' - ');
  }

  get attributeNames(): string[] {
    return this.attributes.map(a => a.name);
  }
  //update product
  updateProduct() {
    // Reset lỗi
    this.imageError = '';
    this.capitalPriceError = '';
    this.priceError = '';
    this.nameError = '';
    this.descriptionError = '';

    let isValid = true;

    // Kiểm tra các trường bắt buộc
    if (!this.name || this.name.trim() === '') {
      this.nameError = 'Tên sản phẩm không được để trống';
      isValid = false;
    }

    if (this.price == null || this.price <= 0) {
      this.priceError = 'Giá bán phải lớn hơn 0';
      isValid = false;
    }

    if (this.capitalPrice == null || this.capitalPrice < 0) {
      this.capitalPriceError = 'Giá vốn không được âm';
      isValid = false;
    }

    if (!this.description || this.description.trim() === '') {
      this.descriptionError = 'Mô tả không được để trống';
      isValid = false;
    }

    if (!this.images || !this.images.some(i => i.file)) {
      this.imageError = 'Vui lòng chọn ít nhất 1 hình ảnh';
      isValid = false;
    }

    if (!isValid) return;
    const updatedProduct = {
      id: this.id,
      name: this.name,
      price: this.price,
      capitalPrice: this.capitalPrice,
      stock: this.stock,
      minStock: this.minStock,
      maxStock: this.maxStock,
      description: this.description,
      note: this.note,
      type: 'PRODUCT',
      brandId: this.selectedBrandId,
      categoryId: this.selectedCateId,
      variants: this.variants,
      barcode: this.barcode
    };
    console.log("Day la variant test" + this.variants);
    this.http.put(`http://localhost:8001/api/products/${this.id}`, updatedProduct)
      .subscribe({
        next: (res) => {
          console.log('Cập nhật thành công', res);
          // Bạn có thể đóng modal hoặc load lại danh sách sản phẩm
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật sản phẩm', err);
        }
      });
  }
}