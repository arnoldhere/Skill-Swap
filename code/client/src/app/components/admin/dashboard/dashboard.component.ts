import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { HeaderComponent } from "../others/header/header.component";
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { SidebarComponent } from "../others/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(
    private toast: ToastService,
    private router: Router,
    private userService: UserService
  ) { }

}
