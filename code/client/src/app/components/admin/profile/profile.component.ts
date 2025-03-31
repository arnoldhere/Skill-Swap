import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HeaderComponent } from '../others/header/header.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProfileComponent } from '../others/edit-profile/edit-profile.component';
import { NewAdminComponent } from '../newadmin/newadmin.component';

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
    const dialogRef = this.dialog.open(NewAdminComponent, {
      width: '40rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAdmins(); // ✅ Refresh admin list after adding
      }
    });
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
        window.location.reload();
      }
    });
  }
}
