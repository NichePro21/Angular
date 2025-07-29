import { Component } from '@angular/core';
import { User } from 'src/app/modules/shared/models/user';
import { AccountService } from 'src/app/modules/shared/services/account.service';
import { AddAccountModalComponent } from './add-account-modal/add-account-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateAccountModalComponent } from './update-account-modal/update-account-modal.component';
import Swal from 'sweetalert2';
import { RoleSelectionModalComponent } from './role-selection-modal/role-selection-modal.component';
import { Account } from 'src/app/modules/shared/models/account';
import { Role } from 'src/app/modules/shared/models/role';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  searchText: any;
  accounts: any[] = [];
  selectedAccount: any;
  isAdmin: boolean = false;
  constructor(private accountService: AccountService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe(
      data => {
        this.accounts = data.data;
        console.log(this.accounts);
      },
      error => {
        console.error('Error fetching accounts', error);
      }
    );
  }
  checkData: any;
  selectAccount(account: any): void {
    this.selectedAccount = account;
    this.loadAccountRoles(account.id);
  }

  loadAccountRoles(accountId: number): void {
    this.accountService.getAccountRoles(accountId).subscribe(
      response => {
        const data = response.data;
        if (data && Array.isArray(data.roles)) {
          this.selectedAccount.roles = data.roles;
        } else {
          console.error('Invalid data format', response);
        }
      },
      error => {
        console.error('Error fetching account roles', error);
      }
    );
  }
  openAddAccountModal(): void {
    const modalRef = this.modalService.open(AddAccountModalComponent, {
      backdrop: false, // Không cho phép đóng modal khi nhấn ra ngoài
      keyboard: true, // Không cho phép đóng modal khi nhấn Esc
      size: 'xl'
    });
    modalRef.result.then((result) => {
      if (result === 'success') {
        // Logic để cập nhật danh sách tài khoản nếu thêm tài khoản thành công
        this.loadAccounts();
      }
    }).catch((error) => {
      console.error('Error opening add account modal:', error);
    });
  }
  openEditAccountModal(account: any): void {
    const modalRef = this.modalService.open(UpdateAccountModalComponent, {
      backdrop: false,
      keyboard: true,
      size: 'xl'
    });

    modalRef.componentInstance.account = account; // Truyền dữ liệu tài khoản vào modal

    modalRef.result.then((result) => {
      if (result === 'success') {
        this.loadAccounts();
      }
    }).catch((error) => {
      console.error('Error opening update account modal:', error);
    });
  }

  changeRoles(account: Account): void {
    const modalRef = this.modalService.open(RoleSelectionModalComponent, {
      backdrop: false,
      keyboard: true,
      size: 'xl'
    });
    modalRef.componentInstance.roles = account.roles;

    modalRef.result.then((selectedRoles: Role[]) => {
      const newRoles = selectedRoles.map((role: Role) => ({ id: role.id }));
      this.accountService.updateAccountRoles(account.id, newRoles).subscribe(
        response => {
          Swal.fire('Thành công', 'Cập nhật vai trò thành công', 'success');
          this.loadAccounts();
        },
        error => {
          Swal.fire('Lỗi', 'Cập nhật vai trò thất bại', 'error');
        }
      );
    }).catch((error) => {
      console.log('Role change modal dismissed', error);
    });
  }

  openDeleteAccountModal(account: any): void {
    Swal.fire({
      title: 'Xác nhận xóa tài khoản',
      text: `Bạn có chắc chắn muốn xóa tài khoản ${account.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accountService.deleteAccount(account.id).subscribe(
          response => {
            Swal.fire('Thành công', 'Xóa tài khoản thành công', 'success');
            this.loadAccounts();
          },
          error => {
            Swal.fire('Lỗi', error.message || 'Xóa tài khoản thất bại.', 'error');
          }
        );
      }
    });
  }
  hasAdminRole(account: any): boolean {
    return account.roles && account.roles.some((role: Role) => role.name === 'ROLE_ADMIN');
  }
  //disable and enable
  onToggleAccountStatus(account: any): void {
    Swal.fire({
      title: 'Bạn có chắc?',
      text: `Bạn muốn ${account.isDisable ? 'kích hoạt' : 'đình chỉ'} cho tài khoản này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (account.isDisable) {
          this.accountService.enableAccount(account.id).subscribe(response => {
            account.isDisable = false;
            Swal.fire(
              'Enabled!',
              'Tài khoản đã được kích hoạt.',
              'success'
            );
          }, error => {
            console.error('Error enabling account', error);
            Swal.fire(
              'Error!',
              'There was an error enabling the account.',
              'error'
            );
          });
        } else {
          this.accountService.disableAccount(account.id).subscribe(response => {
            account.isDisable = true;
            Swal.fire(
              'Disabled!',
              'Tài khoản đã bị đình chỉ.',
              'success'
            );
          }, error => {
            console.error('Error disabling account', error);
            Swal.fire(
              'Error!',
              'There was an error disabling the account.',
              'error'
            );
          });
        }
      }
    });
  }
}
