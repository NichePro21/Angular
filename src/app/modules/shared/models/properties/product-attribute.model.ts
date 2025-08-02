import { AttributeValue } from "./attribute-value.model";

export interface ProductAttribute {
    id?: number;
    name: string;
    values: AttributeValue[];         // Dùng để hiển thị chip
    newValue?: string;
    selectedValues?: AttributeValue[]; // Dùng khi sinh tổ hợp
}