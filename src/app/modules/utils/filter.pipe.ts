import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      const id = it.phone ? String(it.phone).toLowerCase() : '';
      const email = it.email ? String(it.email).toLowerCase() : '';
      const name = it.name ? it.name.toLowerCase() : '';
      return name.includes(searchText) || id.includes(searchText) || email.includes(searchText);
    });
  }
}
