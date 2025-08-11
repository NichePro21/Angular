import { AttributeValueDTO } from "./AttributeValueDTO";

export interface AttributeValueOptionDTO {
  id: number;
  name: string; // <-- bạn chưa gán
  value: string;
  attributeId: number;
}