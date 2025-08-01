import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginResponse } from '../response/login.response';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApi = 'http://localhost:8001/api';
  private signUp = 'http://localhost:8001/api/sign-up';
  private loginApi = 'http://localhost:8001/api/login';
  private forgotApi = 'http://localhost:8001/api/forgot-password';
  private readonly getUserInfoApi = 'http://localhost:8001/api/v3/user-info';
  private readonly TOKEN_KEY = 'token';
  constructor(private jwtHelper: JwtHelperService, private http: HttpClient, private router: Router) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.signUp}`, user);
  }
  login(emailOrUsername: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(`${this.loginApi}`, { emailOrUsername, password }).pipe(
      tap(response => {
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token); // Lưu trữ token
        } else {
          console.error('Token is missing in the response');
        }
      })
    );
  }
  //logout
  logout(): void {
    localStorage.clear()
    this.router.navigate(['/login']);
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.forgotApi}?email=${encodeURIComponent(email)}`, {});
  }
  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseApi}/reset-password?email=${email}&code=${code}&newPassword=${newPassword}`, {});
  }


  // Kiểm tra trạng thái đăng nhập
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  //get user by token
  getUserInfoFromToken(): any {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken;
    }
    return null;

  }
  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.getUserInfoApi}`);
  }
}
