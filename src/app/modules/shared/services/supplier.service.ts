import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Suppliers } from '../models/suppliers';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private SupplierssSubject = new BehaviorSubject<Suppliers[]>([]);
  private selectedSuppliersSubject = new BehaviorSubject<Suppliers | null>(null);

  constructor(private http: HttpClient) {
    this.fetchSupplierss(); // Fetch Supplierss khi khởi tạo service
  }

  get Supplierss$(): Observable<Suppliers[]> {
    return this.SupplierssSubject.asObservable();
  }

  get selectedSuppliers$(): Observable<Suppliers | null> {
    return this.selectedSuppliersSubject.asObservable();
  }

  fetchSupplierss() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ message: string, data: Suppliers[], code: number }>('http://localhost:8001/api/suppliers', { headers })
      .pipe(
        map(response => response.data) // Chỉ lấy phần data từ response
      )
      .subscribe(Supplierss => this.SupplierssSubject.next(Supplierss));
  }

  getSuppliersById(SuppliersId: number) {
    const headers = this.getHeaders(); // Lấy headers có chứa token từ localStorage
    return this.http.get<Suppliers>(`http://localhost:8001/api/suppliers/${SuppliersId}`, { headers })

  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Thêm token vào header Authorization
    });
  }

  addSuppliers(newSuppliers: Suppliers): Observable<Suppliers> {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.decodeToken(token);
      newSuppliers.createdBy = decodedToken.username;
      const headers = this.getHeaders();

      return this.http.post<Suppliers>('http://localhost:8001/api/suppliers', newSuppliers, { headers })
        .pipe(
          tap((Suppliers: Suppliers) => {
            const currentSupplierss = this.SupplierssSubject.getValue();
            this.SupplierssSubject.next([...currentSupplierss, Suppliers]);
          })
        );
    } else {
      throw new Error('No token found');
    }
  }

  updateSuppliers(updatedSuppliers: Suppliers): Observable<Suppliers> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.put<Suppliers>(`http://localhost:8001/api/suppliers/${updatedSuppliers.id}`, updatedSuppliers, { headers })
        .pipe(
          tap(() => {
            const currentSupplierss = this.SupplierssSubject.getValue();
            const index = currentSupplierss.findIndex(p => p.id === updatedSuppliers.id);
            if (index !== -1) {
              currentSupplierss[index] = updatedSuppliers;
              this.SupplierssSubject.next([...currentSupplierss]);
            }
            this.selectedSuppliersSubject.next(updatedSuppliers);
          })
        );
    } else {
      throw new Error('No token found');
    }
  }

  deleteSuppliers(SuppliersId: any): Observable<void> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.delete<void>(`http://localhost:8001/api/suppliers/${SuppliersId}`, { headers })
        .pipe(
          tap(() => {
            const currentSupplierss = this.SupplierssSubject.getValue();
            const updatedSupplierss = currentSupplierss.filter(p => p.id !== SuppliersId);
            this.SupplierssSubject.next(updatedSupplierss);
            this.selectedSuppliersSubject.next(null);
          })
        );
    } else {
      throw new Error('No token found');
    }
  }

  setSelectedSuppliers(Suppliers: Suppliers): void {
    this.selectedSuppliersSubject.next(Suppliers);
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
