import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../modules/auth/login/login.component';
import { RegisterComponent } from '../modules/auth/register/register.component';
import { ForgotPasswordComponent } from '../modules/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../modules/auth/reset-password/reset-password.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { DashboardComponent } from '../modules/auth/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@auth0/angular-jwt';
import { ProfileComponent } from '../layouts/profile/profile.component';
import { CustomerComponent } from '../layouts/customer/customer.component';
import { PartnersComponent } from '../layouts/partners/partners.component';
import { AccountComponent } from '../layouts/account/account.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify', component: ResetPasswordComponent },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'customers', component: CustomerComponent },
      { path: 'partners', component: PartnersComponent },
      { path: 'account', component: AccountComponent },

    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to /login by default
  { path: '**', redirectTo: 'login' }, // Redirect to /login for any other unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
