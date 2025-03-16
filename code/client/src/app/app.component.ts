import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { UserService } from './services/user.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularToastifyModule , MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SkillSwap';
  constructor(private router: Router, private toast: ToastService, private userService: UserService) { }

  ngOnInit() {
  }
}
