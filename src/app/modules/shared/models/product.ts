// product.model.ts
import { Brand } from './brand';
import { Category } from './category';
import { Color } from './properties/color';
import { Size } from './properties/size';
import { Weight } from './properties/weight';

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
  colors: Color[];
  sizes: Size[];
  weights: Weight[];
  stock: number;
  maxStock: number;
  minStock: number;
}
