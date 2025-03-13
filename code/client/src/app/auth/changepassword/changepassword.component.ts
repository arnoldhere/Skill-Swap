import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomToastService } from '../../services/toast.service';

@Component({
  selector: 'app-changepassword',
  imports: [FormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.scss'
})
export class ChangepasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  email: string | null = localStorage.getItem('email'); // Retrieve email from localStorage
  isLoading: boolean = false;
  message: string = '';
  isSuccess: boolean = false;
  showMessage: boolean = false;
  passwordStrengthMessage: string = '';
  passwordsDoNotMatch: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: CustomToastService
  ) { }

  onSubmit(form: NgForm) {
    if (form.invalid || this.newPassword !== this.confirmPassword) {
      form.control.markAllAsTouched();
      this.passwordsDoNotMatch = this.newPassword !== this.confirmPassword;
      this.message = "Passwords do not match!";
      this.showMessage = true;
      return;
    }

    if (!this.email) {
      this.message = "Email is missing. Please try again.";
      this.toast.warning("Email is missing. Please try again.")
      this.showMessage = true;
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.showMessage = false;
    this.toast.warning("Please wait....")
    this.userService.changePassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = response.message;
        this.isSuccess = true;
        this.showMessage = true;

        // Clear email from local storage
        localStorage.removeItem('email');

        // Redirect to login after success
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
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

  checkPasswordStrength() {
    if (this.newPassword.length < 6) {
      this.passwordStrengthMessage = 'Weak password';
    } else if (this.newPassword.match(/[A-Z]/) && this.newPassword.match(/[0-9]/)) {
      this.passwordStrengthMessage = 'Strong password';
    } else {
      this.passwordStrengthMessage = 'Medium strength password';
    }
  }
}
