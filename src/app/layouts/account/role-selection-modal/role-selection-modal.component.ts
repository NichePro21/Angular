import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

interface Role {
  id: number;
  name: string;
  nameRoles?: string;
}

@Component({
  selector: 'app-role-selection-modal',
  templateUrl: './role-selection-modal.component.html',
  styleUrls: ['./role-selection-modal.component.css']
})
export class RoleSelectionModalComponent implements OnInit {
  @Input() roles: Role[] = [];
  selectedRoles: Role[] = [];
  allRoles: Role[] = [
    { id: 1, name: 'ROLE_ADMIN', nameRoles: 'Quản trị viên' },
    { id: 2, name: 'ROLE_EMPLOYEE', nameRoles: 'Nhân viên' },
    { id: 3, name: 'ROLE_CUSTOMER', nameRoles: 'Khách hàng' }
  ]; // Cập nhật danh sách các vai trò có sẵn theo yêu cầu của bạn

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.selectedRoles = [...this.roles];
  }

  // Kiểm tra xem một vai trò có được chọn hay không
  isRoleSelected(role: Role): boolean {
    return this.selectedRoles.some(selectedRole => selectedRole.id === role.id);
  }

  // Thêm hoặc xóa vai trò khỏi danh sách vai trò được chọn
  toggleRoleSelection(role: Role): void {
    if (this.isRoleSelected(role)) {
      this.selectedRoles = this.selectedRoles.filter(selectedRole => selectedRole.id !== role.id);
    } else {
      this.selectedRoles.push(role);
    }
  }

  save(): void {
    if (this.selectedRoles.length === 0) {
      Swal.fire('Lỗi', 'Vui lòng chọn ít nhất một vai trò.', 'error');
      return;
    }
    this.activeModal.close(this.selectedRoles);
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
