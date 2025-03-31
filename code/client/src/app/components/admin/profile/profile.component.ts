import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HeaderComponent } from '../others/header/header.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProfileComponent } from '../others/edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, MatDialogModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  admin: any = {}; // 🎯 Admin data
  admins: any[] = []; // 📊 Admin users data
  defaultPhoto = '../../../../assets/images/default-avatar.png'; // 📸 Default avatar

  private id = localStorage.getItem('id') || '';
  private dialog = inject(MatDialog);

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadAdminData(); // Load admin profile
    this.loadAdmins(); // Load all admins
  }

  // ✅ Load Logged-in Admin Details
  loadAdminData() {
    const id = localStorage.getItem('id') || '';
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
    const id = localStorage.getItem('id') || '';
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
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '35rem',
      height: 'auto',
      data: this.admin, // Pass admin data to modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProfile(result); // Call update if valid
      }
    });
  }

  // 💾 Update Admin Profile After Modal Save
  updateProfile(updatedData: any) {
    this.userService.updateAdminProfile(updatedData).subscribe({
      next: (res: any) => {
        this.admin = res;
        console.log('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      },
    });
  }
}
