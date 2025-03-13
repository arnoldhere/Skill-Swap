import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verifyotp',
  imports: [FormsModule,],
  templateUrl: './verifyotp.component.html',
  styleUrl: './verifyotp.component.scss'
})
export class VerifyotpComponent {
  email: string = localStorage.getItem('email') || ''; // Retrieve stored email
  otp: string[] = ['', '', '', '', '', ''];
  message: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router, private toast: CustomToastService) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const otpCode = this.otp.join(''); // Convert array to a string
    this.isLoading = true;
    this.message = '';

    this.userService.verifyOtp(this.email, otpCode).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = response.message;
        this.isSuccess = true;
        this.toast.warning("Please wait....")
        // Navigate to reset password page
        this.router.navigate(['/auth/changepassword']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        if (err.status === 500) {
          this.toast.error(err.error.message || "Internal server error ... try later");
        } else {
          this.toast.error(err.error.message)
        }
      }
    });
  }

  resendOtp() {
    this.userService.forgetPassword(this.email).subscribe({
      next: (response) => {
        this.message = 'A new OTP has been sent to your email.';
        this.isSuccess = true;
      },
      error: () => {
        this.message = 'Failed to resend OTP. Try again.';
        this.isSuccess = false;
      }
    });
  }
}
