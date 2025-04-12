import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from "angular-toastify";
import { UserService } from "../../../services/user.service";
import { Router, RouterLink, RouterModule } from "@angular/router";
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageUploadDialogComponent } from "./tools/image-upload-dialog/image-upload-dialog.component";
import { EditBioSectionComponent } from "./tools/edit-bio-section/edit-bio-section.component";

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
    MatDialogModule,
    FormsModule,
    MatChipsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading: boolean = true;
  private id = localStorage.getItem("id") || "";
  private dialog = inject(MatDialog);
  isLoading = true;
  isBioExpanded = false;
  error: string | null = null;
  profileCompletion: number = 0;
  activeSection: string = 'overview';

  constructor(
    private toast: ToastService,
    private userService: UserService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
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
        // Redirect after delay
        setTimeout(() => {
          this.router.navigate(["/Home"]);
        }, 2000);
      }
    });
  }
  isAddressValid(location: any): boolean {
    if (!location) return false;
    const { house, area, city, state, pincode } = location;
    return !!(house || area || city || state || pincode);
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

  openImageUploadDialog(): void {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user.profilephoto = result; // Update profile photo
      }
    });
  }

  openBioCard(): void {
    const dialogRef = this.dialog.open(EditBioSectionComponent, { width: '35rem', height: '20rem', data: { bio: this.user?.bio || '' } });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user.bio = result; // Update profile photo
      }
    });

  }

  editSkill(skill: any): void {
    // Open a dialog or navigate to skill edit page
    console.log('Editing skill:', skill);
    // Example: this.router.navigate(['/user/edit-skill', skill._id]);
  }

  viewSkill(skill: any) {
    const certificateUrl = skill?.certificate;
    console.log("Certificate URL:", certificateUrl);

    if (certificateUrl) {
      const backendBaseUrl = 'http://localhost:5000'; // or your deployed domain
      const fullUrl = `${backendBaseUrl}/${certificateUrl}`;
      console.log("Opening certificate:", fullUrl);
      window.open(fullUrl, '_blank');
    } else {
      this.toast.warn('No certificate found for this skill.');
    }
  }

  deleteSkill(skillId: string): void {
    if (confirm('Are you sure you want to delete this skill?')) {
      const uid = localStorage.getItem("id") || "";
      this.userService.deleteSkillById(skillId, uid).subscribe({
        next: (res) => {
          this.user.skills = this.user.skills.filter((s: { _id: string; }) => s._id !== skillId);
          console.log('Skill deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete skill', err);
        }
      });
    }
  }

  handleAddSkill() {
    if (this.user?.skills?.length >= 3) {
      this.toast.error('Only 3 skills are allowed')
      return;
    }

    // Navigate to add skill page if under the limit
    this.router.navigate(['/user/add-skills']);
  }


}
