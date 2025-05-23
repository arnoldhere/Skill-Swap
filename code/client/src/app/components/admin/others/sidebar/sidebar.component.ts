import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isCollapsed = true;
  isMobile = false;

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', link: '/admin/dashboard', active: false },
    { label: 'Users', icon: 'people', link: '/admin/users', active: false },
    { label: 'Skill Category', icon: 'category', link: '/admin/skill-categories', active: false },
    { label: 'Feedback', icon: 'feedback', link: '/admin/feedbacks', active: false },
  ];

  constructor() {
    this.checkScreenSize();
  }

  // 🎯 Toggle Sidebar
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // ✅ Select Active Menu
  selectMenu(item: any) {
    this.menuItems.forEach((menu) => (menu.active = false));
    item.active = true;
  }

  // 📱 Detect Mobile Screen
  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }
}
