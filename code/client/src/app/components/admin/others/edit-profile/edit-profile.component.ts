import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit {
  editForm!: FormGroup;
  loading = false; // 🔄 Loader flag

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar, // ✅ Inject Snackbar
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private userService: UserService, // ✅ Inject UserService
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // ✅ Initialize Form with Admin Data and Add Validations
  initForm() {
    this.editForm = this.fb.group({
      firstname: [
        this.data?.firstname || '',
        [Validators.required, Validators.minLength(3)],
      ],
      lastname: [
        this.data?.lastname || '',
        [Validators.required, Validators.minLength(3)],
      ],
      email: [
        this.data?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [
        this.data?.phone || null,
        [Validators.pattern('^[0-9]{10}$')], // 10-digit phone number validation
      ],
    });
  }

  // 📣 Get Custom Error Messages
  getErrorMessage(controlName: string): string {
    const control = this.editForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.replace(/^\w/, (c) => c.toUpperCase())} is required!`;
    } else if (control?.hasError('email')) {
      return 'Please enter a valid email address!';
    } else if (control?.hasError('minlength')) {
      return `${controlName.replace(/^\w/, (c) => c.toUpperCase())} must be at least ${control.errors?.['minlength'].requiredLength
        } characters!`;
    } else if (control?.hasError('pattern')) {
      return 'Phone number must be 10 digits!';
    }
    return '';
  }

  saveChanges() {
    if (this.editForm.valid) {
      this.loading = true; // 🔄 Show Loader

      const updatedData = this.editForm.value || "";
      const id = this.data._id; // ✅ Get Admin ID passed from parent component

      // 🎯 Call UserService to Update Profile
      this.userService.updateAdminProfile(id , updatedData).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.snackBar.open('Profile updated successfully! 🎉', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
          });
          this.dialogRef.close(res); // ✅ Send updated data back
        },
        error: (err) => {
          this.loading = false;
          console.error('Error updating profile:', err);
          this.snackBar.open('Failed to update profile! ❗', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
        },
      });
    } else {
      this.showValidationErrors();
    }
  }




  // ❌ Cancel & Close Modal
  closeDialog() {
    this.dialogRef.close(null);
  }

  // 🚨 Show Validation Errors
  showValidationErrors() {
    this.snackBar.open('Please fix the validation errors! ❗', 'Close', {
      duration: 3000,
      panelClass: 'error-snackbar',
    });
  }

  // ✅ Get Form Controls for Easy Access
  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }
}
