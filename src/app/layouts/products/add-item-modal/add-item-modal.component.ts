import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ProductAttribute } from 'src/app/modules/shared/models/properties/product-attribute.model';
import { AttributeValue } from 'src/app/modules/shared/models/properties/attribute-value.model';
import { ProductVariant } from 'src/app/modules/shared/models/properties/product-variant.model';
import { VariantAttributeValue } from 'src/app/modules/shared/models/properties/variant-attribute-value.model';
import { Attribute } from 'src/app/modules/shared/models/properties/attribute.model';

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
  constructor(public activeModal: NgbActiveModal, private http: HttpClient, private cd: ChangeDetectorRef) { }
  close() {
    this.activeModal.dismiss();
  }
  imageError = '';
  capitalPriceError = '';
  priceError = '';
  productNameError = '';
  descriptionError = '';
  generatedVariants: ProductVariant[] = [];

  onVariantsChange(updatedVariants: ProductVariant[]) {
    this.generatedVariants = updatedVariants;
  }

  save() {
    // Reset lỗi
    this.imageError = '';
    this.capitalPriceError = '';
    this.priceError = '';
    this.productNameError = '';
    this.descriptionError = '';

    let isValid = true;

    // Kiểm tra các trường bắt buộc
    if (!this.productName || this.productName.trim() === '') {
      this.productNameError = 'Tên sản phẩm không được để trống';
      isValid = false;
    }

    if (this.productPrice == null || this.productPrice <= 0) {
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

    // Chuyển đổi dữ liệu variants thành đúng định dạng cho API
    const mappedVariants = this.generatedVariants.map(v => ({
      price: v.salePrice,

      capitalPrice: v.costPrice,
      stock: v.stock,
      attributeValues: v.attributeValues.map(av => ({
        attributeName: av.attributeValue.attribute.name,
        value: av.attributeValue.value
      }))
    }));
    console.log('mappedVariants', mappedVariants);
    console.log('generatedVariants', this.generatedVariants);
    // Chuẩn bị dữ liệu sản phẩm
    const productRequest = {
      name: this.productName,
      price: this.productPrice,
      capitalPrice: this.capitalPrice,
      stock: this.stock,
      maxStock: this.maxStock,
      minStock: this.minStock,
      description: this.description,
      note: this.note,
      type: 'PRODUCT',
      brandId: this.selectedBrandId,
      categoryId: this.selectedCateId,
      variants: mappedVariants
    };

    // Đóng gói dữ liệu bằng FormData
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productRequest)], { type: 'application/json' }));
    this.images.forEach(img => {
      if (img.file) formData.append('images', img.file);
    });

    // Gửi API
    this.http.post('http://localhost:8001/api/products', formData).subscribe({
      next: () => {
        alert('Thêm sản phẩm thành công!');
        this.activeModal.close();
      },
      error: err => {
        console.error('Lỗi thêm sản phẩm:', err);
      }
    });
  }
  //stock
  handleStockChange(totalStock: number) {
    this.stock = totalStock;
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
    this.fetchAttributeOptions();
    this.inputWidths = this.attributes.map(() => 60); // Giá trị mặc định ban đầu

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
  //attributes
  attributes: ProductAttribute[] = [];
  attributeOptions: ProductAttribute[] = [];

  showAttributes = false;
  newAttributeName = '';
  attributeError = '';
  inputWidths: number[] = [];
  @ViewChildren('hiddenSpan') hiddenSpans!: QueryList<ElementRef>;



  toggleAttributeSection() {
    this.showAttributes = !this.showAttributes;
  }

  // Lấy tất cả thuộc tính từ API
  fetchAttributeOptions() {
    this.http.get<ProductAttribute[]>('http://localhost:8001/api/attributes').subscribe({
      next: (data) => {
        this.attributeOptions = data;
      },
      error: (err) => {
        console.error('Lỗi lấy thuộc tính:', err);
      }
    });
  }

  // Thêm thuộc tính vào sản phẩm
  addAttribute() {
    this.attributes.push({
      name: '',
      values: [],
      selectedValues: [],
      newValue: ''
    });
  }

  // Xóa thuộc tính
  removeAttribute(index: number) {
    this.attributes.splice(index, 1);
    this.generateVariantsFromAttributes();
  }

  // Khi chọn thuộc tính từ dropdown
  handleAttributeChange(event: any, index: number) {
    const selectedName = event.target.value;

    if (selectedName === '__create_new__') {
      this.attributes[index].name = '';
      this.openCreateAttributeModal();
      return;
    }

    const found = this.attributeOptions.find(attr => attr.name === selectedName);
    if (found) {
      this.attributes[index].attribute = {
        name: found.name
      } as Attribute; // ✅ đúng kiểu { name: string }

      this.attributes[index].values = found.values;
      this.attributes[index].selectedValues = [];
    }
  }




  addValue(event: any, attrIndex: number) {
    event.preventDefault();
    const value = this.attributes[attrIndex].newValue?.trim();
    if (!value) return;

    // 🔧 Nếu chưa có values thì khởi tạo mảng rỗng
    if (!this.attributes[attrIndex].values) {
      this.attributes[attrIndex].values = [];
    }

    const existed = this.attributes[attrIndex].values.some(v => v.value === value);
    if (existed) return;

    const attrName = this.attributes[attrIndex].name;
    const matchedAttr = this.attributeOptions.find(opt => opt.name === attrName);

    const newVal: AttributeValue = {
      id: 0,
      value,
      attribute: {
        id: matchedAttr?.id ?? 0,
        name: matchedAttr?.name ?? attrName
      }
    };

    this.attributes[attrIndex].values.push(newVal);

    if (!this.attributes[attrIndex].selectedValues) {
      this.attributes[attrIndex].selectedValues = [];
    }

    this.attributes[attrIndex].selectedValues?.push(newVal);

    this.attributes[attrIndex].newValue = '';
    this.generateVariantsFromAttributes();
    this.cd.detectChanges();
  }





  // Xóa giá trị đã chọn
  removeValue(attrIndex: number, valueIndex: number) {
    const attr = this.attributes[attrIndex];
    if (!attr) return;

    const removed = attr.values.splice(valueIndex, 1)[0];

    if (attr.selectedValues) {
      const indexInSelected = attr.selectedValues.findIndex(v => v.value === removed.value);
      if (indexInSelected > -1) {
        attr.selectedValues.splice(indexInSelected, 1);
      }
    }
    this.generateVariantsFromAttributes();
  }




  // Mở modal tạo mới thuộc tính
  openCreateAttributeModal() {
    ($('#createAttributeModal') as any).modal('show');
  }

  closeCreateAttributeModal() {
    ($('#createAttributeModal') as any).modal('hide');
  }

  // Tạo mới thuộc tính
  createNewAttribute() {
    const name = this.newAttributeName?.trim();

    if (!name) {
      this.attributeError = 'Không thể để trống';
      return;
    }

    if (this.attributeOptions.some(attr => attr.name === name)) {
      this.attributeError = 'Thuộc tính đã tồn tại';
      return;
    }

    const newAttribute = { name };

    this.http.post<ProductAttribute>('http://localhost:8001/api/attributes', newAttribute).subscribe({
      next: (res) => {
        this.attributeOptions.push({ ...res, values: [] });
        this.closeCreateAttributeModal();
        this.attributeError = '';
        this.newAttributeName = '';
      },
      error: () => {
        this.attributeError = 'Không thể tạo thuộc tính. Vui lòng thử lại.';
      }
    });
  }

  // Tự động cập nhật chiều rộng input khi gõ
  updateInputWidth(index: number) {
    const value = this.attributes[index].newValue || '';
    const span = this.hiddenSpans.toArray()[index].nativeElement as HTMLSpanElement;
    span.textContent = value;
    const width = span.offsetWidth + 20;
    this.inputWidths[index] = width;
  }
  // Trả về tổ hợp Cartesian của mảng mảng giá trị (combinations)
  generateVariantsFromAttributes() {
    const selectedAttrs = this.attributes.filter(attr => attr.selectedValues && attr.selectedValues.length > 0);

    // Lấy tất cả tổ hợp AttributeValue
    const combinations = this.getCombinations(
      selectedAttrs.map(attr => attr.selectedValues!)
    );

    this.generatedVariants = combinations.map((combination: AttributeValue[]) => {
      const attributeValues: VariantAttributeValue[] = combination.map((value: AttributeValue) => ({
        attributeValue: value
      }));

      return {
        price: 0,
        capitalPrice: 0,
        stock: 0,
        attributeValues
      };
    });
  }

  getCombinations(arrays: AttributeValue[][]): AttributeValue[][] {
    if (arrays.length === 0) return [];

    return arrays.reduce((acc, curr) => {
      const result: AttributeValue[][] = [];
      acc.forEach(a => {
        curr.forEach(b => {
          result.push([...a, b]);
        });
      });
      return result;
    }, [[]] as AttributeValue[][]);
  }



  cartesianProduct(arrays: AttributeValue[][]): AttributeValue[][] {
    return arrays.reduce<AttributeValue[][]>(
      (acc, curr) => acc.flatMap(a => curr.map(c => [...a, c])),
      [[]]
    );
  }
  onAttributeValuesChanged() {
    this.generateVariantsFromAttributes();
  }
  // Sinh tổ hợp các biến thể
  // generateVariantsFromAttributes() {
  //   // Lọc ra các thuộc tính có selectedValues hợp lệ
  //   const validAttributes = this.attributes.filter(attr => attr.selectedValues && attr.selectedValues.length > 0);

  //   // Nếu không có thuộc tính hoặc không có giá trị được chọn → xoá bảng
  //   if (validAttributes.length === 0) {
  //     this.generatedVariants = [];
  //     return;
  //   }

  //   const selectedAttrValues = validAttributes.map(attr => attr.selectedValues!);

  //   const combinations = this.cartesianProduct(selectedAttrValues);

  //   this.generatedVariants = combinations.map((combo: AttributeValue[]) => ({
  //     stock: 0,
  //     sku: '',
  //     barcode: '',
  //     costPrice: 0,
  //     salePrice: 0,
  //     attributeValues: combo.map(av => ({ attributeValue: av }))
  //   }));
  // }


  // Hàm sinh tổ hợp
  // cartesianProduct(arr: AttributeValue[][]): AttributeValue[][] {
  //   return arr.reduce((a, b) =>
  //     a.flatMap(d => b.map(e => [...d, e])),
  //     [[]] as AttributeValue[][]
  //   );
  // }
  trackByVariant(index: number, variant: ProductVariant) {
    return variant.sku ?? index;
  }

}
