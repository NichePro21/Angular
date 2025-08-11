import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductVariant } from 'src/app/modules/shared/models/properties/product-variant.model';

@Component({
  selector: 'app-variant-table',
  templateUrl: './variant-table.component.html',
  styleUrls: ['./variant-table.component.css']
})
export class VariantTableComponent {
  @Input() variants: ProductVariant[] = [];
  @Output() variantsChange = new EventEmitter<ProductVariant[]>();
  @Output() stockChange = new EventEmitter<number>();
  getVariantLabel(variant: ProductVariant): string {
    return variant.attributeValues
      .map(av => av.attributeValue.value)
      .join(' - ');
  }

  // Gọi mỗi khi một trường nào đó trong bảng bị thay đổi
  onVariantFieldChange() {
    this.variantsChange.emit(this.variants);
    const totalStock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    this.stockChange.emit(totalStock);
  }

}
