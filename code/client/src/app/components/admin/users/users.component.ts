import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../others/sidebar/sidebar.component";
import { HeaderComponent } from '../others/header/header.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-users',
  imports: [SidebarComponent, HeaderComponent, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService, private toast: ToastService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  // ✅ Fetch all users
  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  // 📥 Download user data as CSV
  downloadData() {
    const csvData = this.convertToCSV(this.users);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'users_data.csv');
    a.click();
  }
  // 🔥 Convert JSON to CSV
  convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data
      .map((row) => Object.values(row).join(','))
      .join('\n');
    return headers + rows;
  }

  // 📅 Format date for display
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
