import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../others/sidebar/sidebar.component";
import { HeaderComponent } from '../others/header/header.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

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


  // viewUser(userId: string) {
  //   // this.router.navigate(['/user/user-details', userId]); // Navigates to the user details page
  //   this.userService.getUserById(userId).subscribe({})
  // }

  filteredUsers(): any[] {
    let filtered = this.users.filter((user) => {
      const term = this.searchTerm.toLowerCase();
      return (
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.location?.city?.toLowerCase().includes(term) ||
        user.location?.state?.toLowerCase().includes(term)
      );
    });

    if (this.sortColumn) {
      filtered = filtered.sort((a, b) => {
        const valA = a[this.sortColumn]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn]?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    return filtered;
  }

  changeSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  downloadData() {
    const csvData = this.convertToCSV(this.filteredUsers());
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'users_data.csv');
    a.click();
  }

  convertToCSV(data: any[]): string {
    const headers = ['Email', 'Phone', 'City', 'State'];
    const rows = data.map(u =>
      [u.email, u.phone, u.location?.city || '-', u.location?.state || '-'].join(',')
    );
    return headers.join(',') + '\n' + rows.join('\n');
  }
}
