export interface Attribute {
    id: number;
    name: string;
    selectedValues: { id: number; value: string }[];
    newValue: string;
}
export interface AttributeValue {
    id: number;
    value: string;
    attributeName: string;
}

export interface AttributeValueDTO {
    id?: number;         // nếu null -> giá trị mới chưa có id từ server
    value: string;
    attributeId?: number;
}

export interface AttributeWithValuesDTO {
    id?: number; // id của attribute (nếu có)
    name: string;
    values: AttributeValueDTO[];        // tất cả giá trị có sẵn của attribute
    selectedValues?: AttributeValueDTO[]; // giá trị đang được chọn/đính kèm vào product
    newValue?: string;                  // input tạm khi user nhập value mới
}

export interface ProductVariantRequest {
    price: number;
    capitalPrice: number;
    stock: number;
    attributeValues: AttributeValueDTO[];
}
export interface AttributeOption {
    id: number;
    name: string;
    values?: AttributeValueDTO[];
}