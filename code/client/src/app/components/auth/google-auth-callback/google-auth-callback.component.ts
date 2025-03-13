import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
// import { CustomToastService } from '../../../services/toast.service';;


@Component({
  selector: 'app-google-auth-callback',
  imports: [],
  templateUrl: './google-auth-callback.component.html',
  styleUrl: './google-auth-callback.component.scss'
})
export class GoogleAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const firstname = params['firstname'];
      const lastname = params['lastname'];

      if (token) {
        this.userService.storeUserData(token, firstname, lastname);
        this.router.navigate(['/Home']); // Redirect to home page
      } else {
        this.router.navigate(['/Login']); // Redirect back to login on error
      }
    });
  }
}
