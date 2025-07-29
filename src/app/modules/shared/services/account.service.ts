import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'http://localhost:8001/api/accounts';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Thay thế bằng token thực tế hoặc lấy từ localStorage/sessionStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAccounts(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAccountRoles(accountId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${accountId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  addAccount(account: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, account)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAccount(accountId: number, accountData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${accountId}`, accountData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAccountRoles(accountId: number, roles: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${accountId}/roles`, roles, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }


  deleteAccount(accountId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${accountId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
  // disable and enable
  enableAccount(accountId: number): Observable<any> {
    const url = `${this.apiUrl}/${accountId}/enable`;
    return this.http.put(url, {}, { headers: this.getHeaders() });
  }

  disableAccount(accountId: number): Observable<any> {
    const url = `${this.apiUrl}/${accountId}/disable`;
    return this.http.put(url, {}, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi không xác định.';

    if (error.error instanceof ErrorEvent) {
      // Lỗi client-side hoặc lỗi mạng
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi từ server
      errorMessage = `Lỗi ${error.status}: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    // Log lỗi cho việc kiểm tra
    console.error(errorMessage);

    // Trả về Observable với lỗi
    return throwError(() => new Error(errorMessage));
  }
}
