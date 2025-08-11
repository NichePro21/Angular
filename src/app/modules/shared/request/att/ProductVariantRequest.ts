import { AttributeValueDTO } from "./AttributeValueDTO";

export interface ProductVariantRequest {
  price: number;
  capitalPrice: number;
  stock: number;
  attributeValues: AttributeValueDTO[];
}