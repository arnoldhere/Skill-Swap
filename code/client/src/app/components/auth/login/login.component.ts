import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
// import { CustomToastService } from '../../../services/toast.service';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  auth: any = {
    email: '',
    password: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  showErrorPopup: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    if (this.userService.isLoggedIn()){
      this.router.navigate(['/Home']);
    }
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.login(this.auth).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        localStorage.setItem('firstname', response.firstname);
        localStorage.setItem('lastname', response.lastname);
        localStorage.setItem("role", response.role)
        localStorage.setItem("id", response.id)
        // console.log(response.role);
        this.toast.success(response.message);
        setTimeout(() => {

          if (response.role === "admin") {
            this.router.navigate(['/admin/dashboard']);
          } else if (response.role === "user") {
            this.router.navigate(['/Home']);
          } else {
            this.toast.error("Invalid role....")
            // return;
          }
        }, 2500);

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

  // Method to handle Google login
  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/Auth/Google';
  }
}
