import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '../modules/auth/login/login.component';
import { RegisterComponent } from '../modules/auth/register/register.component';
import { DashboardComponent } from '../modules/auth/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from '../modules/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../modules/auth/reset-password/reset-password.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ProfileComponent } from '../layouts/profile/profile.component';
import { EditAddressModalComponent } from '../layouts/profile/component/edit-address-modal/edit-address-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MainLayoutComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
    ProfileComponent,
    EditAddressModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
