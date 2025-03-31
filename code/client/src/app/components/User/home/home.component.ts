import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../others/navbar/navbar.component';
import { FooterComponent } from '../../others/footer/footer.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from 'angular-toastify';
// import { CustomToastService } from '../../../services/toast.service';;

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

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
  }

}
