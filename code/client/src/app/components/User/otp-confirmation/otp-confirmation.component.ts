import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-confirmation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-confirmation.component.html',
  styleUrl: './otp-confirmation.component.scss'
})
export class OtpConfirmationComponent {
  otp = new FormControl('');
  isVerifying = false;
  errorMsg = '';

  constructor(private toast: ToastService, private router: Router) { }

  private dialogRef = inject(MatDialogRef<OtpConfirmationComponent>);
  private data = inject(MAT_DIALOG_DATA);
  private userService = inject(UserService);

  async verifyOTP() {
    this.isVerifying = true;
    this.errorMsg = '';

    console.log(this.otp.value)
    this.userService.OtpConfirmation(this.data.request, this.otp.value).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || "Stage updated successfully...");
        this.dialogRef.close(true); // Close modal before navigation or reload
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || 'Unable to verify. Try again.';
        this.toast.error(this.errorMsg);
        this.isVerifying = false;
      }
    });
  }

}
