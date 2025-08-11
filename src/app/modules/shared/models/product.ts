import { Brand } from './brand';
import { Category } from './category';

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  capitalPrice: number;
  description?: string;
  imageUrl?: string;
  type: string;
  brand: Brand;
  category: Category;
  stock: number;
  maxStock: number;
  minStock: number;
  note?: string;
  variants: Product[];
  // variants?: ProductVariant[]; 
}