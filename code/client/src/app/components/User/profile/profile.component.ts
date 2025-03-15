import { Component, OnInit } from "@angular/core";
import { ToastService } from "angular-toastify";
import { UserService } from "../../../services/user.service";
import { Router, RouterModule } from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger
} from "@angular/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatChipsModule, MatChipListbox } from "@angular/material/chips";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavbarComponent } from "../../others/navbar/navbar.component";
import { DomSanitizer } from "@angular/platform-browser";


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
    NavbarComponent,
    CommonModule,
    FormsModule,
    MatChipsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading: boolean = true;
  private id = localStorage.getItem("id") || "";

  isLoading = true;
  isBioExpanded = false;
  error: string | null = null;
  profileCompletion: number = 0;
  activeSection: string = 'overview';

  // Default placeholder data
  placeholderUser = {
    firstName: 'John',
    lastName: 'Doe',
    profilePhoto: 'assets/images/default-avatar.png',
    professionalRole: 'Web Developer',
    bio: 'Passionate developer with expertise in web technologies. Always eager to learn and collaborate with others.',
    contact: {
      email: 'user@example.com',
      phone: '+1 123 456 7890'
    },
    skillsOffered: ['HTML', 'CSS', 'JavaScript'],
    skillsSeeking: ['Python', 'React Native'],
    availabilityStatus: 'offline',
    availableTimeSlots: []
  };


  constructor(
    private toast: ToastService,
    private userService: UserService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // Register custom SVG icons
    this.registerSocialIcons();
  }


  ngOnInit(): void {
    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.userService.getCurrentUser(this.id).subscribe({
      next: (userData: any) => {
        this.user = userData;
        // console.log(this.user);
        this.calculateProfileCompletion();
        this.loading = false; // Stop loading when data is fetched
        // Calculate profile completion percentage

      },
      error: (err) => {
        console.error("Error fetching user:", err);
        this.toast.error("Failed to load profile data... try again later");
        this.error = "Failed to load profile data";
        this.loading = false;
        this.isLoading = false;

        // Redirect after delay
        setTimeout(() => {
          this.router.navigate(["/Home"]);
        }, 2000);
      }
    });
  }
  // Register social media SVG icons
  private registerSocialIcons(): void {
    // LinkedIn icon
    this.iconRegistry.addSvgIcon(
      'linkedin',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg')
    );

    // GitHub icon
    this.iconRegistry.addSvgIcon(
      'github',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg')
    );

    // Twitter icon
    this.iconRegistry.addSvgIcon(
      'twitter',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter.svg')
    );
  }
  // Calculate profile completion percentage
  private calculateProfileCompletion(): void {
    if (!this.user) return;

    const fields = [
      !!this.user.firstName,
      !!this.user.lastName,
      !!this.user.bio,
      !!(this.user.contact && this.user.contact.email),
      !!(this.user.contact && this.user.contact.phone),
      !!(this.user.skillsOffered && this.user.skillsOffered.length > 0),
      !!(this.user.availableTimeSlots && this.user.availableTimeSlots.length > 0),
      !!this.user.profilePhoto
    ];

    const completedFields = fields.filter(field => field).length;
    this.profileCompletion = Math.round((completedFields / fields.length) * 100);
  }
  // Set active section
  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  // Get file extension from URL
  getFileExtension(url: string): string {
    if (!url) return '';
    return url.split('.').pop()?.toLowerCase() || '';
  }

  // Handle image error
  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-avatar.png';
  }
}
