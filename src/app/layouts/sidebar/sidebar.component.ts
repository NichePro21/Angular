import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  username: string | null = null;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    const userInfo = this.authService.getUserInfoFromToken();
    if (userInfo && userInfo.username) {
      this.username = userInfo.username;
    }
  }
}
