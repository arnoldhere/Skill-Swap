import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavbarComponent } from '../../others/navbar/navbar.component';
import { FooterComponent } from '../../others/footer/footer.component';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, NavbarComponent, FooterComponent],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(30px)' })),
      transition(':enter', [animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
    ]),
  ],
})
export class ContactUsComponent {
  contactForm!: FormGroup;
  isSubmitting: boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private toast: ToastService, private userService: UserService) {
    this.initializeForm();
  }

  // ✅ Initialize Form
  initializeForm() {
    this.contactForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  // ⭐️ Set Rating Value
  setRating(value: number) {
    this.contactForm.patchValue({ rating: value });
  }

  // ✅ Form Submission Handler
  onSubmit() {
    if (this.contactForm.invalid) {
      this.toast.error('Please fill in all required fields correctly!');
      return;
    }

    this.isSubmitting = true;
    const id = localStorage.getItem('id') || '';
    const formData = {
      ...this.contactForm.value,
      type: this.contactForm.value.rating > 0 ? 'Rating' : 'Feedback',
    };

    this.userService.saveFeedback(id, formData).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.isSubmitting = false;
          this.toast.success(res.message || 'Your message has been sent successfully!');
          this.contactForm.reset(); // Reset the form after submission
          this.contactForm.patchValue({ rating: 0 }); // Reset rating to 0
        }, 1500);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Failed to save feedback. Try again.');
        console.log(err);
      },
    });
  }
}
