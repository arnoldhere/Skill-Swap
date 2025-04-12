import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../others/navbar/navbar.component';
import { FooterComponent } from '../../others/footer/footer.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
import { CommonModule } from '@angular/common';
// import { CustomToastService } from '../../../services/toast.service';;

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  skillCategories: any[] = []; // Store categories

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      if (this.userService.getRole() === "admin") {
        this.router.navigate(['/admin/dashboard']);
      }
    }
    // Fetch skill categories
    this.userService.fetchSkillsCategory().subscribe({
      next: (data) => {
        this.skillCategories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.toast.error('Failed to load categories!');
      }
    });

  }

  browseSkill(id:string){
    this.router.navigate(['/user/browse-skill', id]); // Navigates to the user details page
  }

}
