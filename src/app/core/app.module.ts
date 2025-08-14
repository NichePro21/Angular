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
import { EditAddressModalComponent } from '../layouts/profile/edit-address-modal/edit-address-modal.component';
import { CustomerComponent } from '../layouts/customer/customer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterPipe } from '../modules/utils/filter.pipe';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddCustomerModalComponent } from '../layouts/customer/add-customer-modal/add-customer-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { UpdateCustomerModalComponent } from '../layouts/customer/update-customer-modal/update-customer-modal.component';
import { AccountComponent } from '../layouts/account/account.component';
import { AddAccountModalComponent } from '../layouts/account/add-account-modal/add-account-modal.component';
import { UpdateAccountModalComponent } from '../layouts/account/update-account-modal/update-account-modal.component';
import { RoleSelectionModalComponent } from '../layouts/account/role-selection-modal/role-selection-modal.component';
import { ProductsComponent } from '../layouts/products/products.component';
import { AddItemModalComponent } from '../layouts/products/add-item-modal/add-item-modal.component';
import { VariantTableComponent } from '../layouts/products/add-item-modal/variant-table/variant-table.component';
import { UpdateItemModalComponent } from '../layouts/products/update-item-modal/update-item-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AddSupplierModalComponent } from '../layouts/supplier/add-supplier-modal/add-supplier-modal.component';
import { SupplierComponent } from '../layouts/supplier/suppliers.component';
import { UpdateSuppliersModalComponent } from '../layouts/supplier/update-partner-modal/update-supplier-modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
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
    EditAddressModalComponent,
    CustomerComponent,
    SupplierComponent,
    FilterPipe,
    AddCustomerModalComponent,
    UpdateCustomerModalComponent,
    AddSupplierModalComponent,
    UpdateSuppliersModalComponent,
    AccountComponent,
    AddAccountModalComponent,
    UpdateAccountModalComponent,
    RoleSelectionModalComponent,
    ProductsComponent,
    AddItemModalComponent,
    VariantTableComponent,
    UpdateItemModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule, // cần thiết để sử dụng ngx-toastr
    JwtModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    NgbModule,
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
