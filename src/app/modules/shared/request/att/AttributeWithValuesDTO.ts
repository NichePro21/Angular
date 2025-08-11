import { AttributeValueDTO } from "./AttributeValueDTO";
import { AttributeValueOptionDTO } from "./AttributeValueOptionDTO";

export interface AttributeWithValuesDTO {
  id: number;
  attributeId: number;
  name: string;
  values: AttributeValueOptionDTO[];
  selectedValues: AttributeValueOptionDTO[];
  newValue: string; // để user nhập giá trị mới
}
