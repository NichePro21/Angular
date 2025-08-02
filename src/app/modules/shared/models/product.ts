import { Brand } from './brand';
import { Category } from './category';
import { ProductVariant } from './properties/product-variant.model';

export interface Product {
  id: number;
  name: string;
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
  variants?: ProductVariant[]; 
}