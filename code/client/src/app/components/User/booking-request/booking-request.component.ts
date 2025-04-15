import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../others/navbar/navbar.component";
import { FooterComponent } from "../../others/footer/footer.component";

@Component({
  selector: 'app-booking-request',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class BookingRequestComponent implements OnInit {
  requestForm!: FormGroup;
  skillId = '';
  swapperId = '';
  todayDate: string = '';
  requesterId = ""


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Get current date in yyyy-MM-dd format
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    this.requesterId = localStorage.getItem("id")!;
    this.swapperId = this.route.snapshot.paramMap.get('swapperId')!;
    this.skillId = this.route.snapshot.paramMap.get('skillId')!;

    this.requestForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      message: ['']
    });
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.toast.error('Please fill all required fields.');
      return;
    }

    const selectedDate = new Date(this.requestForm.value.date);
    const currentDate = new Date(this.todayDate);

    if (selectedDate < currentDate) {
      this.toast.error('Please select a valid future date.');
      return;
    }

    const requestData = {
      skillId: this.skillId,
      requesterId: this.requesterId,
      swapperId: this.swapperId,
      ...this.requestForm.value
    };
    console.log(requestData)
    this.userService.bookSwapper(this.swapperId, this.requesterId, requestData).subscribe({
      next: () => {
        this.toast.success('Booking request sent successfully!');
        this.router.navigate(['/user/explore']); // or wherever
      },
      error: (err) => {
        this.toast.error(err.message.message ||'You have already booked or internal error..');
        console.error(err);
      }
    });
  }

}
