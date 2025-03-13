import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { trigger, transition, style, animate } from "@angular/animations";
import { NgApexchartsModule } from "ng-apexcharts";
import { ApexChart, ApexAxisChartSeries, ApexXAxis, ApexTitleSubtitle } from "ng-apexcharts";


interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
}


@Component({
  selector: 'app-profile',
  imports: [CommonModule, DragDropModule, NgApexchartsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  animations: [
    trigger("tabAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  userProfile = {
    name: "Sarah Johnson",
    bio: "Full-stack developer passionate about learning and sharing knowledge",
    location: "San Francisco, CA",
    isOnline: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  };

  profileCompletion = 85;
  activeTab = "mySkills";

  mySkills = [
    { name: "JavaScript", level: "expert", proficiency: 90, endorsements: 42 },
    { name: "React", level: "advanced", proficiency: 85, endorsements: 38 },
    { name: "Node.js", level: "intermediate", proficiency: 75, endorsements: 29 }
  ];

  wantToLearn = [
    { name: "Python", matchPercentage: 89 },
    { name: "Data Science", matchPercentage: 75 },
    { name: "AWS", matchPercentage: 92 }
  ];

  achievements = [
    { name: "Quick Learner", icon: "https://images.unsplash.com/photo-1533383586648-6711f3e1adc8", unlocked: true },
    { name: "Skill Master", icon: "https://images.unsplash.com/photo-1523240795612-9a054b0db644", unlocked: true },
    { name: "Team Player", icon: "https://images.unsplash.com/photo-1521737711867-e3b97375f902", unlocked: false }
  ];

  chartOptions: ChartOptions = {
    series: [{
      name: "Skill Growth",
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }],
    chart: {
      height: 350,
      type: "line" as const
    },
    title: {
      text: "Skill Progress Over Time"
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    }
  };

  constructor() { }

  ngOnInit(): void { }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
}
