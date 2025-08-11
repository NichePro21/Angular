
import { ProductVariantRequest } from "./att/ProductVariantRequest";


export interface ProductRequest {
  id?: number;
  name: string;
  price: number;
  capitalPrice: number;
  description?: string;
  type: 'PRODUCT';
  brandId?: number;
  categoryId?: number;
  stock?: number;
  maxStock?: number;
  minStock?: number;
  note?: string;
  variants?: ProductVariantRequest[];
}
