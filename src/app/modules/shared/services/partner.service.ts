import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Partner } from '../models/partner';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private partnersSubject = new BehaviorSubject<Partner[]>([]);
  private selectedPartnerSubject = new BehaviorSubject<Partner | null>(null);

  constructor(private http: HttpClient) {
    this.fetchPartners(); // Fetch partners khi khởi tạo service
  }

  get partners$(): Observable<Partner[]> {
    return this.partnersSubject.asObservable();
  }

  get selectedPartner$(): Observable<Partner | null> {
    return this.selectedPartnerSubject.asObservable();
  }

  fetchPartners() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ message: string, data: Partner[], code: number }>('http://localhost:8001/api/partners', { headers })
      .pipe(
        map(response => response.data) // Chỉ lấy phần data từ response
      )
      .subscribe(partners => this.partnersSubject.next(partners));
  }

  getPartnerById(partnerId: number) {
    const headers = this.getHeaders(); // Lấy headers có chứa token từ localStorage
    return this.http.get<Partner>(`http://localhost:8001/api/partners/${partnerId}`, { headers })

  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Thêm token vào header Authorization
    });
  }

  addPartner(newPartner: Partner): Observable<Partner> {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.decodeToken(token);
      newPartner.createdBy = decodedToken.username;
      const headers = this.getHeaders();

      return this.http.post<Partner>('http://localhost:8001/api/partners', newPartner, { headers })
        .pipe(
          tap((partner: Partner) => {
            const currentPartners = this.partnersSubject.getValue();
            this.partnersSubject.next([...currentPartners, partner]);
          })
        );
    } else {
      throw new Error('No token found');
    }
  }

  updatePartner(updatedPartner: Partner): Observable<Partner> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.put<Partner>(`http://localhost:8001/api/partners/${updatedPartner.id}`, updatedPartner, { headers })
        .pipe(
          tap(() => {
            const currentPartners = this.partnersSubject.getValue();
            const index = currentPartners.findIndex(p => p.id === updatedPartner.id);
            if (index !== -1) {
              currentPartners[index] = updatedPartner;
              this.partnersSubject.next([...currentPartners]);
            }
            this.selectedPartnerSubject.next(updatedPartner);
          })
        );
    } else {
      throw new Error('No token found');
    }
  }

  deletePartner(partnerId: any): Observable<void> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.delete<void>(`http://localhost:8001/api/partners/${partnerId}`, { headers })
        .pipe(
          tap(() => {
            const currentPartners = this.partnersSubject.getValue();
            const updatedPartners = currentPartners.filter(p => p.id !== partnerId);
            this.partnersSubject.next(updatedPartners);
            this.selectedPartnerSubject.next(null);
          })
        );
    } else {
      throw new Error('No token found');
    }
  }

  setSelectedPartner(partner: Partner): void {
    this.selectedPartnerSubject.next(partner);
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
