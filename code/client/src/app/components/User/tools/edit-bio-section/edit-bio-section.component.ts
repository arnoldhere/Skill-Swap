import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-edit-bio-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './edit-bio-section.component.html',
  styleUrl: './edit-bio-section.component.scss'
})
export class EditBioSectionComponent {
  bioForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditBioSectionComponent>,
    private fb: FormBuilder,
    private toast: ToastService,
    private userService: UserService
  ) {
    this.bioForm = this.fb.group({
      bio: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }


  closeDialog() {
    this.dialogRef.close();
  }

  saveBio() {
    if (this.bioForm.invalid) {
      this.toast.error('Please enter a valid bio (10-500 characters).');
      return;
    }

    this.isLoading = true;
    const id = localStorage.getItem('id') || "";
    this.userService.updateUserBio(id, this.bioForm.value).subscribe({
      next: (res) => {
        this.toast.success(res.message || 'Bio updated successfully!');
        this.isLoading = false;
        this.dialogRef.close(this.bioForm.value.bio);
      },
      error: (res) => {
        this.toast.error(res.message || 'Failed to update bio. Try again.');
        this.isLoading = false;
      }
    });
  }
}
