import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../../services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../../others/navbar/navbar.component';
import { FooterComponent } from '../../../others/footer/footer.component';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent
  ],
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm!: FormGroup;
  user: any = {}; // Store user data
  states: string[] = []; // List of states
  cities: string[] = []; // List of cities based on selected state
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData(); // Load user data to form
    this.fetchStates(); // Fetch unique states
  }

  // ✅ Initialize Form with Validators
  initializeForm() {
    this.personalInfoForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      house: ['', Validators.required],
      area: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }

  // ✅ Load User Data and Fill Form
  loadUserData() {
    console.log(localStorage.getItem("id"))
    const id = localStorage.getItem("id") || "";
    this.userService.getCurrentUser(id).subscribe({
      next: (userData: any) => {
        console.log(userData)
        if (userData) {
          this.user = userData;
          this.personalInfoForm.patchValue(this.user);
          // Load cities if the state field is pre-filled
          if (this.user.state) {
            this.fetchCities(this.user.state);
          }
        } else {
          this.toast.error("No user data available");
        }
      },
      error: (err) => {
        console.error("Error loading user data:", err);
        this.toast.error("Failed to load user data. Please try again.");
      },
    });
  }

  // ✅ Fetch All States from DB
  fetchStates() {
    this.userService.getStates().subscribe({
      next: (res: any) => {
        this.states = res.states;
      },
      error: (err) => {
        this.toast.error('Failed to load states');
      }
    });
  }

  fetchCities(selectedState: string) {
    if (selectedState) {
      this.userService.getCitiesByState(selectedState).subscribe({
        next: (res: any) => {
          this.cities = res.data.map((cityObj: any) => cityObj.city);
        },
        error: (err) => {
          console.error('Error loading cities:', err);
          this.toast.error('Failed to load cities');
        },
      });
    } else {
      console.error('No state selected.');
      this.cities = [];
    }
  }

  updatePersonalInfo() {
    if (this.personalInfoForm.invalid) {
      this.toast.error("Please fill all required fields correctly!");
      return;
    }
    this.isLoading = true;
    const id = localStorage.getItem("id") || "";
    const updatedData = this.personalInfoForm.getRawValue(); // Get form data

    this.userService.updateUser(id, updatedData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toast.success(res.message || "Profile updated successfully!");
          this.isLoading = false;
          console.clear()
          this.router.navigate(['/user/profile']);
        } else {
          this.toast.error(res.error || "Failed to update profile");
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.toast.error(err.error?.error || "Failed to update profile");
        this.isLoading = false;
      },
    });
  }


}
