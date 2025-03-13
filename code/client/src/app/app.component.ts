import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularToastifyModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SkillSwap';
  constructor(private router: Router, private toast: ToastService, private userService: UserService) { }

  ngOnInit() {
    // if (this.userService.isLoggedIn()) {
    //   if (localStorage.getItem("userRole") === "user") {
    //     this.router.navigate(["/Home"]);
    //   } else if (localStorage.getItem("userRole") === "admin") {
    //     this.router.navigate(["/admin/dashboard"]);
    //   }
    // }
    if (localStorage.getItem("role") === "user") {
      this.toast.warn("You can not access this page.");
      this.router.navigate(["/Home"]);

    } else if (localStorage.getItem("role") === "admin") {
      this.toast.warn("You can not access this page.");
      this.router.navigate(["/admin/dashboard"]);

    }

  }
}
