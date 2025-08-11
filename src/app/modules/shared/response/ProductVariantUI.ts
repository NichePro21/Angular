import { ProductVariantRequest } from "../request/att/ProductVariantRequest";

export interface ProductVariantUI extends ProductVariantRequest {
  name?: string; // chỉ dùng để hiển thị ở UI
}
