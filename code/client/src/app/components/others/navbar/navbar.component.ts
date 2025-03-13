import { Router, RouterLink } from '@angular/router';
import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../../services/user.service';
import { CustomToastService } from '../../../services/toast.service';

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

  isScrolled = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: CustomToastService
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 80; // Detect scroll position
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  getFirstName(): string {
    return localStorage.getItem('firstname') || 'User';
  }

  logout(): void {
    this.userService.logout();
    // Redirect to home or login page
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
      this.toast.success("Logout successfuly....")
      window.location.reload(); // Reload to enforce logout state
    }, 1900);

  }
}
