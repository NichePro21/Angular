import { VariantAttributeValue } from "./variant-attribute-value.model";

export interface ProductVariant {
  stock: number;
  attributeValues: VariantAttributeValue[];
  sku?: string;
  barcode?: string;
  costPrice?: number;
  salePrice?: number;
}
