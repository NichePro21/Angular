import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductUI } from '../response/ProductUI';
import { AttributeOption, AttributeWithValuesDTO } from '../models/properties/attributes.model';
@Injectable({ providedIn: 'root' })
export class AttributeService {
  private apiUrl = 'http://localhost:8001/api/attributes';

  constructor(private http: HttpClient) { }

  getAttributesByProduct(productId: number): Observable<AttributeWithValuesDTO[]> {
    return this.http.get<AttributeWithValuesDTO[]>(`${this.apiUrl}/by-product/${productId}`);
  }
  // Lấy toàn bộ attribute để hiển thị dropdown
  getAllAttributes(): Observable<AttributeOption[]> {
    return this.http.get<AttributeOption[]>(this.apiUrl);
  }

  // Lấy attribute + values đã liên kết với product


  // Tạo attribute mới (nếu cần)
  createAttribute(payload: { name: string }): Observable<AttributeOption> {
    return this.http.post<AttributeOption>(this.apiUrl, payload);
  }

  // (tùy backend) lấy values theo attribute id
  getValuesByAttribute(attributeId: number) {
    return this.http.get<AttributeOption>(`${this.apiUrl}/${attributeId}`);
  }

}
