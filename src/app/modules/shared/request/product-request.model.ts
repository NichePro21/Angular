import { ProductVariant } from "../models/properties/product-variant.model";


export interface ProductRequest {
  name: string;
  price: number;
  capitalPrice: number;
  description?: string;
  type: string;
  brandId: number;
  categoryId: number;
  stock: number;
  maxStock: number;
  minStock: number;
  note?: string;
  variants?: ProductVariant[];
}
