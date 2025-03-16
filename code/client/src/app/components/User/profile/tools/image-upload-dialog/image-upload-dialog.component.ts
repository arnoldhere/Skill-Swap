import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-image-upload-dialog',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './image-upload-dialog.component.html',
  styleUrl: './image-upload-dialog.component.scss'
})
export class ImageUploadDialogComponent {

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ImageUploadDialogComponent>,
    private toast: ToastService,
    private userService: UserService
  ) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      this.toast.error("Please select a file before uploading.");
      return;
    }

    this.isUploading = true;
    this.toast.warn("Uploading...");

    const id = localStorage.getItem("id") || "";

    this.userService.uploadProfilePhoto(this.selectedFile, id).subscribe({
      next: (response) => {
        this.toast.success("Profile picture updated!");
        this.dialogRef.close(response.filePath);
        this.dialogRef.close(this.previewUrl);
      },
      error: (error) => {
        this.toast.error("Failed to upload image.");
        console.error("Upload error:", error);
      },
      complete: () => {
        this.isUploading = false; // ✅ Reset after upload
      }
    });
  }
  closeDialog() {
    this.dialogRef.close(null);
  }
}

