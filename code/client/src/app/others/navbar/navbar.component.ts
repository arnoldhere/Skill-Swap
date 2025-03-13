import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CustomToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: CustomToastService
  ) { }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  getFirstName(): string {
    return localStorage.getItem('firstname') || 'User';
  }

  logout(): void {
    this.userService.logout();
    // Optionally clear other items
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    // Redirect to home or login page
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
      this.toast.success("Logout successfuly....")
    }, 3000);
  }
}
