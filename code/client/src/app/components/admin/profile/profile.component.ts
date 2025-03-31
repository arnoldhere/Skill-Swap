import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../others/navbar/navbar.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  admin: any = {}; // 🎯 Logged-in admin data
  admins: any[] = []; // 📊 Admin users data
  defaultPhoto = 'assets/images/default-avatar.png'; // 📸 Default avatar

  // ✨ Edit Modal State
  isEditModalOpen = false;
  editForm: any = {};

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadAdminData(); // Load current admin profile
    this.loadAdmins(); // Fetch all admin users
  }

  // ✅ Load Logged-in Admin Details
  loadAdminData() {
    const id = localStorage.getItem("id") || "";
    this.userService.getAdminProfile(id).subscribe({
      next: (res: any) => {
        this.admin = res;
      },
      error: (err) => {
        console.error('Error loading admin profile:', err);
      },
    });
  }

  // 📊 Fetch All Admin Users
  loadAdmins() {
    const id = localStorage.getItem("id") || "";
    this.userService.getAdminUsers(id).subscribe({
      next: (res: any) => {
        this.admins = res;
      },
      error: (err) => {
        console.error('Error fetching admins:', err);
      },
    });
  }

  // ➕ Add Admin Button Click
  addAdmin() {
    console.log('Add Admin functionality coming soon...');
  }

  // ✏️ Open Edit Profile Modal
  openEditModal() {
    this.editForm = { ...this.admin }; // Clone current admin data
    this.isEditModalOpen = true;
  }

  // ❌ Close Edit Modal
  closeEditModal() {
    this.isEditModalOpen = false;
  }

  // 💾 Update Admin Profile
  updateProfile() {
    this.userService.updateAdminProfile(this.editForm).subscribe({
      next: (res: any) => {
        this.admin = res;
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      },
    });
  }
}
