import { AttributeValue } from "./attribute-value.model";

export interface AttributeOption {
  id: number;
  name: string;
  values?: AttributeValue[];
}