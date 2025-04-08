import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
import { NavbarComponent } from "../../others/navbar/navbar.component";
import { FooterComponent } from "../../others/footer/footer.component";

@Component({
  selector: 'app-explore',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit {
  users: any[] = [];
  defaultAvatar = 'assets/img/default-user.png';
  loggedInUserId: string | null = null;

  constructor(private toast: ToastService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        // this.users = res.filter((u: { _id: string; }) => u._id !== this.userService.getUserId());
        // Get logged-in user's ID from localStorage
        this.loggedInUserId = localStorage.getItem('id');
        // Filter out the logged-in user
        this.users = res.filter((u: { _id: string | null; }) => u._id !== this.loggedInUserId);
        // this.users = res;
      },
      error: (err) => {
        this.toast.error("Failed to load users 😓");
        console.error(err);
      }
    });
  }

  connect(userId: string) {
    // Trigger message, invite, or redirect to chat/profile
    this.router.navigate(['/chat', userId]);
  }

}
