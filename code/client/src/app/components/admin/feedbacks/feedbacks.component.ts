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
  selector: 'app-feedbacks',
  imports: [SidebarComponent, HeaderComponent, CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.scss'
})
export class FeedbacksComponent implements OnInit {
  feedbacks: any[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.fetchFeedbacks();
  }

  fetchFeedbacks() {
    this.userService.getFeedbackRating().subscribe({
      next: (res: any) => {
        this.feedbacks = res;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  filteredfeeds(): any[] {
    let filtered = this.feedbacks.filter((f) => {
      const term = this.searchTerm.toLowerCase();
      return (
        f.subject?.toLowerCase().includes(term) ||
        f.feedback?.toLowerCase().includes(term) ||
        f.rating?.toLowerCase().includes(term) ||
        f.user?.toLowerCase().includes(term)
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

}
