import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './newadmin.component.html',
  styleUrl: './newadmin.component.scss',
})
export class NewAdminComponent implements OnInit {
  addForm!: FormGroup;
  loading = false; // 🔄 Loader flag

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewAdminComponent>,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // ✅ Initialize Form with Validations
  initForm() {
    this.addForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
    });
  }

  // 📣 Get Custom Error Messages
  getErrorMessage(controlName: string): string {
    const control = this.addForm.get(controlName);
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

  // 💾 Add Admin Logic
  addAdmin() {
    if (this.addForm.valid) {
      this.loading = true;
      const adminData = this.addForm.value;

      this.userService.addAdmin(adminData).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.snackBar.open('Admin added successfully! 🎉', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
          });
          this.dialogRef.close(res);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error adding admin:', err);
          this.snackBar.open('Failed to add admin! ❗', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
        },
      });
    } else {
      this.showValidationErrors();
    }
  }

  // ❌ Close Modal
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
    return this.addForm.controls;
  }
}
