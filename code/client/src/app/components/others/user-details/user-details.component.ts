import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent]
})
export class UserDetailsComponent implements OnInit {
  userId: string = '';
  user: any;
  defaultAvatar = 'assets/img/default-user.png';

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (res) => {
          this.user = res.user;
          // console.log(this.user)
        },
        error: (err) => {
          console.error("Failed to fetch user details", err);
        }
      });
    }
  }
}
