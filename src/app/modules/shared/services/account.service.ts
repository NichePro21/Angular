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

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
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
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
