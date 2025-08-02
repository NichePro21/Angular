import { Attribute } from "./attribute.model";

export interface AttributeValue {
  id: number;
  value: string;
  attribute: Attribute;
}
