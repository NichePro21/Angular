// models.ts

export interface CustomAttributeValue {
  id: number;
  value: string;
  attributeName: string;
}

export interface CustomAttribute {
  id: number;
  name: string;
  selectedValues: CustomAttributeValue[];
  // Có thể thêm thuộc tính 'values' nếu cần lưu toàn bộ giá trị có thể chọn
  values?: CustomAttributeValue[];
  newValue?: string; // cho input thêm giá trị mới (nếu có)
}

export interface CustomVariantAttributeValue {
  attributeValue: CustomAttributeValue;
}

export interface CustomProductVariant {
  price?: number;
  capitalPrice?: number;
  stock: number;
  attributeValues: CustomVariantAttributeValue[];
}

// Nếu bạn cần interface riêng cho update attribute (có thể giống CustomAttribute)
export interface UpdateAttribute {
  id: number;
  name: string;
  selectedValues: CustomAttributeValue[];
}
export interface MyAttribute {
  id: number;
  name: string;
}

export interface MyAttributeValue {
  id: number;
  value: string;
  attribute: MyAttribute;  // Bắt buộc có attribute
}

export interface MyVariantAttributeValue {
  attributeValue: MyAttributeValue;
}

export interface MyProductVariant {
  stock: number;
  attributeValues: MyVariantAttributeValue[];
  sku?: string;
  barcode?: string;
  costPrice?: number;
  salePrice?: number;
}
