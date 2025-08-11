import { AttributeValueDTO } from "../request/att/AttributeValueDTO";

export interface ProductResponseDTO {
  id: number;
  name: string;
  price: number;
  capitalPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  description: string;
  note: string;
  type: string;
  brandId: number;
  categoryId: number;
  variants: ProductVariantDTO[];
}

export interface ProductVariantDTO {
  price: number;
  capitalPrice: number;
  stock: number;
  attributeValues: AttributeValueDTO[];
}

