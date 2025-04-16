import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-commission-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './commission-chart.component.html',
  styleUrls: ['./commission-chart.component.css'],
})
export class CommissionChartComponent implements OnInit {
  constructor(private userService: UserService) { }
  // Chart Data for Line Chart
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Daily Commission',
        fill: true,
        tension: 0.4,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.2)',
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8b5cf6',
      },
    ],
  };

  // Chart Options
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };

  // Ensure valid Chart Type
  public lineChartType: ChartType = 'line' as ChartType;
  ngOnInit() {
    this.userService.getCommissionData().subscribe((data) => {
      const result = Array.isArray(data) ? data : data.fees; // handle wrapped data

      const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const commissionData = new Array(7).fill(0);

      result.forEach((item: any) => {
        commissionData[item._id - 1] = item.totalCommission;
      });

      this.lineChartData.labels = labels;
      this.lineChartData.datasets[0].data = commissionData;
    });
  }

}
