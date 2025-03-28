import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { ToastService } from 'angular-toastify';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatBadgeModule, MatMenuModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  notificationsCount = 5; // Set notification count
  isProfileMenuOpen = false;
  user: any = null;
  loading: boolean = true;
  private id = localStorage.getItem("id") || "";
  isLoading = true;
  isBioExpanded = false;
  error: string | null = null;

  constructor(
    private toast: ToastService,
    private router: Router,
    private userService: UserService
  ) { }
  ngOnInit(): void {
    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    this.userService.getCurrentUser(this.id).subscribe({
      next: (userData: any) => {
        this.user = userData;
        // console.log(this.user);
        this.loading = false; // Stop loading when data is fetched

      },
      error: (err) => {
        console.error("Error fetching user:", err);
        this.toast.error("Failed to load profile data... try again later");
        // Redirect after delay
        setTimeout(() => {
          this.router.navigate(["/Home"]);
        }, 2000);
      }
    });
  }
  // ✅ Toggle Profile Menu
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  // 🔔 Handle Notification Click
  openNotifications() {
    alert('Open notifications!');
  }

  // ➡️ Logout Handler
  logout() {
    alert('Logging out...');
    // Add your logout logic here
  }
}
