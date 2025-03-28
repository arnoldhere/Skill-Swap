import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { UserService } from './services/user.service';
import { MatDialogModule } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularToastifyModule , MatDialogModule],
  providers: [ToastService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'SkillSwap';
  constructor(private router: Router, private toast: ToastService, private userService: UserService) { }

  ngOnInit() {
  }
}
