import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
import { NavbarComponent } from "../../others/navbar/navbar.component";

@Component({
  selector: 'app-browse-skill',
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './browse-skill.component.html',
  styleUrl: './browse-skill.component.scss',
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]

})
export class BrowseSkillComponent implements OnInit {
  users: any[] = [];
  defaultAvatar: string = 'assets/img/default-user.png';
  selectedCategoryId: string = '';
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // fetch 'id' from the route
      this.selectedCategoryId = this.route.snapshot.paramMap.get('id') || '';
      console.log('Skill Category ID:', this.selectedCategoryId);

      if (this.selectedCategoryId) {
        this.userService.getUsersBySkillCategory(this.selectedCategoryId).subscribe({
          next: (res: any) => {
            this.users = res.users;
            console.log('Filtered Users:', this.users);
          },
          error: (err) => {
            console.error('Failed to fetch users by skill category:', err);
          }
        });
      }
      else {
        this.toast.error("Error to fetch category...try again later")
      }
    });
  }

  chat(userId: string): void {
    // You can navigate to chat page or open chat modal
    console.log('Chat with:', userId);
    this.router.navigate(['/chat', userId]);
  }

  view(userId: string): void {
    this.router.navigate(['/user/user-details', userId]); // Navigates to the user details page
  }

}
