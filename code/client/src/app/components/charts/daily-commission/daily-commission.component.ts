import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../services/user.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-daily-commission',
  imports: [NgxChartsModule],
  templateUrl: './daily-commission.component.html',
  styleUrl: './daily-commission.component.scss'
})
export class DailyCommissionComponent implements OnInit {


  constructor(private toast: ToastService, private userService: UserService) { }
  commissionData: any[] = [];

  ngOnInit() {
    this.userService.dailyCommission().subscribe({
      next: (res: any) => {
        // Assume response is like { result: [...] }
        this.commissionData = res.result.map((item: any) => ({
          name: item._id,
          value: item.totalCommission
        }));
        console.log("Commission data:", this.commissionData); // ✅ For debugging
      },
      error: (err) => {
        this.toast.error("Failed to fetch commission data");
      }
    });
  }

}
