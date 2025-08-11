
import { AttributeOption } from "./attribute-option.model";
import { AttributeValue } from "./attribute-value.model";
import { Attribute } from "./attribute.model";

export interface ProductAttribute {
  id?: number;
  name: string;
  attribute?: Attribute;
  values: AttributeValue[];               // Chip hiển thị
  newValue?: string;
  selectedValues?: AttributeValue[];      // Chọn khi sinh tổ hợp
  selectedAttribute?: AttributeOption;    // Binding với dropdown
}
