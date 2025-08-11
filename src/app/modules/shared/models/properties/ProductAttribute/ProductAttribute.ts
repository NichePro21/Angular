export interface ProductAttribute {
    id?: number;              // ID thuộc tính (nếu đã tồn tại trong DB)
    name: string;              // Tên thuộc tính
    values: string[];          // Danh sách giá trị đã chọn
    newValue?: string;         // Giá trị mới (chỉ dùng cho UI khi thêm mới)
    
}