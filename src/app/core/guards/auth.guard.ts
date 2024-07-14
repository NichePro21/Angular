import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../modules/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  // checkLogin(): boolean {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     // Người dùng đã đăng nhập
  //     this.router.navigate(['/dashboard']);
  //     return false;
  //   }
  //   return true;
  // }
}
