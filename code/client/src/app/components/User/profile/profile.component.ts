import { Component, OnInit } from "@angular/core";
import { ToastService } from "angular-toastify";
import { UserService } from "../../../services/user.service";
import { Router, RouterModule } from "@angular/router";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatChipsModule, MatChipListbox } from "@angular/material/chips";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavbarComponent } from "../../others/navbar/navbar.component";


@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    RouterModule,
    MatProgressBarModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatChipsModule,
    ReactiveFormsModule,
    NavbarComponent
],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading: boolean = true;
  private id = localStorage.getItem("id") || "";

  // profile: any = {
  //   id: '1',
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   profilePhoto: 'https://i.pravatar.cc/300',
  //   professionalRole: 'Full Stack Developer',
  //   bio: 'Passionate developer with 5+ years of experience in web technologies. Always eager to learn and share knowledge with others.',
  //   contact: {
  //     email: 'john.doe@example.com',
  //     phone: '+1 234 567 8900'
  //   },
  //   skillsOffered: ['JavaScript', 'Angular', 'Node.js', 'TypeScript', 'React'],
  //   skillsSeeking: ['Python', 'Data Science', 'Machine Learning'],
  //   socialMedia: {
  //     linkedin: 'https://linkedin.com/in/johndoe',
  //     twitter: 'https://twitter.com/johndoe',
  //     github: 'https://github.com/johndoe'
  //   },
  //   availabilityStatus: 'online',
  //   availableTimeSlots: [
  //     { day: 'Monday', slots: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'] },
  //     { day: 'Wednesday', slots: ['10:00 AM - 3:00 PM'] },
  //     { day: 'Friday', slots: ['1:00 PM - 6:00 PM'] }
  //   ]
  // };



  isLoading = true;
  isBioExpanded = false;
  error: string | null = null;

  constructor(
    private toast: ToastService,
    private userService: UserService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.userService.getCurrentUser(this.id).subscribe({
      next: (userData: any) => {
        this.user = userData;
        // console.log(this.user);
        this.loading = false; // Stop loading when data is fetched
      },
      error: (err) => {
        console.error("Error fetching user:", err);
        this.toast.error("Failed to load profile data..try again later");
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(["/Home"]);
        }, 2000);
      }
    });
  }
}
