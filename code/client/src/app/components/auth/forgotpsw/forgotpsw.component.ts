import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
// import { CustomToastService } from '../../../services/toast.service';;


@Component({
  selector: 'app-forgotpsw',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgotpsw.component.html',
  styleUrls: ['./forgotpsw.component.scss']
})
export class ForgotpswComponent {
  email: string = '';
  isLoading: boolean = false;
  message: string = '';
  isSuccess: boolean = false;
  showMessage: boolean = false;


  constructor(
    private userService: UserService,
    private router: Router,
    private toast: ToastService
  ) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.showMessage = false;
    this.toast.warn("Please wait...")

    this.userService.forgetPassword(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toast.success(response.message)
        this.message = response.message;
        this.isSuccess = true;
        this.showMessage = true;
        localStorage.setItem('email', this.email);
        this.router.navigate(['/auth/verifyotp']);
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

  closeMessage() {
    this.showMessage = false;
  }
}
