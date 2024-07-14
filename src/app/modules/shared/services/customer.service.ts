import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.fetchCustomers(); // Fetch customers khi khởi tạo service
  }

  get customers$() {
    return this.customersSubject.asObservable();
  }

  get selectedCustomer$(): Observable<Customer | null> {
    return this.selectedCustomerSubject.asObservable();
  }

  fetchCustomers() {
    this.http.get<Customer[]>('http://localhost:8001/api/customers')
      .subscribe(customers => this.customersSubject.next(customers));
  }

  getCustomerById(customerId: number) {
    return this.http.get<Customer>(`http://localhost:8001/api/customers/${customerId}`);
  }

  addCustomer(newCustomer: Customer) {
    const token = localStorage.getItem('token');
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      throw new Error('Missing or expired token');
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    newCustomer.createdBy = decodedToken.username;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Customer>('http://localhost:8001/api/customers', newCustomer, { headers })
      .pipe(
        tap((customer: Customer) => {
          const currentCustomers = this.customersSubject.getValue();
          this.customersSubject.next([...currentCustomers, customer]);
        })
      );
  }

  updateCustomer(customer: Customer) {
    return this.http.put<Customer>(`http://localhost:8001/api/customers/${customer.id}`, customer)
      .pipe(
        tap(updatedCustomer => {
          const currentCustomers = this.customersSubject.getValue();
          const index = currentCustomers.findIndex(c => c.id === updatedCustomer.id);
          if (index !== -1) {
            currentCustomers[index] = updatedCustomer;
            this.customersSubject.next([...currentCustomers]);
          }
        })
      );
  }

  deleteCustomer(customerId: any): Observable<void> {


    return this.http.delete<void>(`http://localhost:8001/api/customers/${customerId}`)
      .pipe(
        tap(() => {
          const currentCustomers = this.customersSubject.getValue();
          const updatedCustomers = currentCustomers.filter(c => c.id !== customerId);
          this.customersSubject.next(updatedCustomers);
          this.selectedCustomerSubject.next(null); // Xóa khách hàng được chọn
        })
      );
  }
  setSelectedCustomer(customer: Customer): void {
    this.selectedCustomerSubject.next(customer);
  }
}
