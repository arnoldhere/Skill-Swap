import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
// import { CustomToastService } from '../../../services/toast.service';;
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  user: any = {};
  selectedFile: File | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  registrationSuccess: boolean = false;
  showErrorPopup: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: ToastService,
  ) { }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // Check if passwords match
    if (this.user.password !== this.user.confirmpassword) {
      this.toaster.error("Passwords do not match");
      return;
    }

    // Validate profile photo (check if a file is selected)
    if (!this.selectedFile) {
      this.toaster.error("Please select a profile image.");
      return;
    }
    if (this.selectedFile.size > 5000000) {
      this.toaster.error("Image size must be smaller than 5 MB");
      return;
    }

    // Validate file type (ensure it's an image)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.toaster.error("Only JPEG, JPG, and PNG images are allowed.");
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('firstname', this.user.firstname);
    formData.append('lastname', this.user.lastname);
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);
    formData.append('phone', this.user.phone);

    // Append profile photo to FormData if selected
    formData.append('profilephoto', this.selectedFile, this.selectedFile.name);

    this.userService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.registrationSuccess = true;
        this.toaster.info(response.message);
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2500);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.showErrorPopup = true; // Show error popup

        // Handle specific HTTP status codes
        switch (error.status) {

          case 400:

            this.toaster.error(error.message);
            console.log(error);
            break;
          case 401:
            this.toaster.error(error.message);
            console.log(error);
            break;
          case 402:
            this.toaster.error(error.message || "Forbidden. You don't have permission to register.");
            console.log(error);
            break;
          default:
            this.toaster.error(error.message ||  "Something went wrong. Please try again.");
            console.log(error);
        }

        console.error("Error:", error.message);
      }
    });
  }
}
