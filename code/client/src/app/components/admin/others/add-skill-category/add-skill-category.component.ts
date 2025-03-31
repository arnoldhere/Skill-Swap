import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SkillCategoryComponent } from '../../skill-category/skill-category.component';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-add-skill-category',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './add-skill-category.component.html',
  styleUrl: './add-skill-category.component.scss'
})
export class AddSkillCategoryComponent implements OnInit {

  editForm!: FormGroup;
  loading = false; // 🔄 Loader flag
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar, // ✅ Inject Snackbar
    private dialogRef: MatDialogRef<SkillCategoryComponent>,
    private userService: UserService, // ✅ Inject UserService
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }



  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }


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

      const categoryData = this.editForm.value; // ✅ Correct data for add
      this.userService.addSkillCategory(categoryData).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.snackBar.open('Category added successfully! 🎉', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
          });
          this.dialogRef.close(res); // ✅ Close Modal with new data
        },
        error: (err) => {
          this.loading = false;
          console.error('Error adding category:', err);
          this.snackBar.open('Failed to add category! ❗', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
        },
      });
    } else {
      this.showValidationErrors(); // 🚨 Show validation errors
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
