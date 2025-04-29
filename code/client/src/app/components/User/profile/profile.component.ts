import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
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
declare var Razorpay: any;
import { environment } from '../../../../../src/environments/environment';
import { OtpConfirmationComponent } from "../otp-confirmation/otp-confirmation.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { NgxPaginationModule } from "ngx-pagination";

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
    RouterLink,
    NgxPaginationModule
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
  exchangeRequests: any = null;
  bookingRequests: any = null;
  currentPage = 1;
  itemsPerPage = 4;
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private toast: ToastService,
    private userService: UserService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {
    // Register custom SVG icons
    this.registerSocialIcons();
  }

  ngOnInit(): void {
    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    // fetch requests
    this.userService.getAllExchangeRequests(this.id).subscribe({
      next: (res: any) => {
        this.exchangeRequests = res
        console.log(this.exchangeRequests)
      },
      error: (err: any) => {
        console.log(err)
        this.toast.error(err.message || "internal server error...")
      }
    })

    this.userService.getAllBookingRequests(this.id).subscribe({
      next: (res: any) => {
        this.bookingRequests = res
      },
      error: (err: any) => {
        console.log(err)
        this.toast.error(err.message || "internal server error...")
      }
    })

    this.userService.getCurrentUser(this.id).subscribe({
      next: (userData: any) => {
        this.user = userData;
        // console.log(this.user);
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
    this.router.navigate(['/user/edit-skill', skill._id]);
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

  deleteReq(id: string) {
    if (!window.confirm('Are you sure you want to delete ?')) return;

    this.userService.deleteExchangeRequest(id).subscribe({
      next: (res: any) => {
        this.toast.info(res.message || "Deleted succefully..")
        window.location.reload()
      },
      error: (err: any) => {
        this.toast.info(err.message || "error in delete..")
      }
    })
  }

  deleteBooking(id: string) {
    if (!window.confirm('Are you sure you want to cancel ?')) return;

    this.userService.deleteBookingReq(id).subscribe({
      next: (res: any) => {
        this.toast.info(res.message || "Deleted succefully..")
        window.location.reload()
      },
      error: (err: any) => {
        this.toast.info(err.message || "error in delete..")
      }
    })
  }

  acceptBooking(id: string) {
    if (!window.confirm('Are you sure you want to accept ?')) return;

    this.userService.acceptBookingReq(id).subscribe({
      next: (res: any) => {
        this.toast.info(res.message || "Accepted succefully..")
        window.location.reload()
      },
      error: (err: any) => {
        this.toast.info(err.message || "error in delete..")
      }
    })
  }
  pay(requestId: string) {
    this.http.post(`${environment.apiBaseUrl}/pay/create-order`, { requestId }).subscribe((order: any) => {
      const options = {
        key: environment.razorpayKey, // 🔑 Replace with your real key
        amount: order.amount,
        currency: 'INR',
        name: 'SkillSwap',
        description: 'Skill Exchange Payment',
        order_id: order.orderId,
        handler: (response: any) => {
          this.http.post(`${environment.apiBaseUrl}/pay/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            requestId: requestId
          }).subscribe((res: any) => {
            alert('✅ Payment Successful');
            window.location.reload();
          }, (err) => {
            alert('❌ Payment verification failed');
          });
        },
        prefill: {
          name: 'SkillSwap User',
          email: 'user@example.com'
        },
        theme: {
          color: '#0d9488'
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  }

  stageModify(id: string) {
    this.userService.modifyStage(id).subscribe({
      next: (res: any) => {
        this.toast.info(res.message || "OTP sent successfully");

        const dialogRef = this.dialog.open(OtpConfirmationComponent, {
          width: '35rem',
          height: '20rem',
          data: { request: id }
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.toast.success("Updated successfully.... Please wait...");
            setTimeout(() => window.location.reload(), 1500);
          }
        });

      },
      error: (err: any) => {
        this.toast.error(err.message || "Error sending OTP");
      }
    });
  }


  filteredExchangeRequests(): any[] {
    let filtered = this.exchangeRequests.filter((req: any) => {
      const term = this.searchTerm.toLowerCase();
      return (
        req.skill?.toLowerCase().includes(term) ||
        req.status?.toLowerCase().includes(term) ||
        req.swapper?.toLowerCase().includes(term) ||
        req.date?.toLowerCase().includes(term) ||
        req.note?.toLowerCase().includes(term) ||
        req.payment?.toLowerCase().includes(term) ||
        req.stage?.toLowerCase().includes(term)
      );
    });

    if (this.sortColumn) {
      filtered.sort((a: any, b: any) => {
        const valA = a[this.sortColumn]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn]?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    return filtered;
  }

  filteredBookingRequests(): any[] {
    let filtered = this.bookingRequests.filter((req: any) => {
      const term = this.searchTerm.toLowerCase();
      return (
        req.skill?.toLowerCase().includes(term) ||
        req.status?.toLowerCase().includes(term) ||
        req.requester?.toLowerCase().includes(term) ||
        req.date?.toLowerCase().includes(term) ||
        req.note?.toLowerCase().includes(term) ||
        req.payment?.toLowerCase().includes(term) ||
        req.stage?.toLowerCase().includes(term)
      );
    });

    if (this.sortColumn) {
      filtered.sort((a: any, b: any) => {
        const valA = a[this.sortColumn]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn]?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    return filtered;
  }


  changeSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

}
