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
      const firstname = it.firstname ? it.firstname.toLowerCase() : '';
      const lastname = it.lastname ? it.lastname.toLowerCase() : '';
      return name.includes(searchText) || id.includes(searchText) || email.includes(searchText) || firstname.includes(searchText) || lastname.includes(searchText);
    });
  }
}
