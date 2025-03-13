import { Component } from '@angular/core';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    private toast: ToastService
  ) { }


}
