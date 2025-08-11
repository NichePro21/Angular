// export interface AttributeValueDTO {
//   attributeId?: number;       // có thể null nếu client tạo mới
//   attributeName?: string;     // tên thuộc tính mới
//   value: string;
// }

export interface AttributeValueDTO {
  id?: number;
  value: string;
  attributeId?: number;
  attributeName?: string;
}