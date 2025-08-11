import { ProductRequest } from "../request/product-request.model";
import { ProductVariantUI } from "./ProductVariantUI";

export interface ProductUI extends ProductRequest {
  id: number;
  variants: ProductVariantUI[];
}
