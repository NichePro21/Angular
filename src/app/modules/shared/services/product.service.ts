// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductRequest } from '../request/product-request.model';
import { ProductResponseDTO } from '../response/ProductResponseDTO';
import { ApiResponse } from '../response/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8001/api/products';

  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // Hàm lấy danh sách sản phẩm cha (có variants)
  getAllProductParentOnly(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  // Nếu chưa có API riêng thì fallback lấy tất cả
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  // Lấy tất cả sản phẩm
  getProducts(): Observable<{ message: string; data: Product[]; code: number }> {
    return this.http.get<{ message: string; data: Product[]; code: number }>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Lấy một sản phẩm theo ID
  getProductById(id: number): Observable<ApiResponse<ProductResponseDTO>> {
    return this.http.get<ApiResponse<ProductResponseDTO>>(`http://localhost:8001/api/products/${id}`);
  }


  updateProduct(productId: number, payload: ProductRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, payload);
  }
  // create product
  createProduct(
    product: Product,
    parentImage?: File,
    variantImages?: { key: string, file: File }[]
  ): Observable<Product> {
    const formData = new FormData();

    // 1. Chuyển product thành JSON string
    formData.append('product', JSON.stringify(product));

    // 2. Thêm ảnh parent
    if (parentImage) {
      formData.append('parentImage', parentImage);
    }

    // 3. Thêm ảnh biến thể và key
    if (variantImages && variantImages.length > 0) {
      variantImages.forEach(v => {
        formData.append('variantImages', v.file);  // phải đúng tên field API
        formData.append('variantKeys', v.key);
      });
    }

    return this.http.post<Product>(this.apiUrl, formData);
  }
}
