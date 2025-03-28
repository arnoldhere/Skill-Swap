import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../others/navbar/navbar.component';
import { FooterComponent } from '../../others/footer/footer.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss',
})
export class AboutUsComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}

  isScrolled = false;
  public communityPhoto: string = 'assets/images/about1.jpeg';
  public skillSwapPhoto: string = 'assets/images/about2.jpeg';
  public growPhoto: string = 'assets/images/about3.jpeg';
  feedbacks: any[] = [];
  activeIndex = 0;
  autoSlideInterval: any;

  ngOnInit(): void {
    this.loadGoodFeedbacks();
    this.startAutoSlide(); // 🔥 Start Auto-slide on component load
  }

  ngOnDestroy(): void {
    this.stopAutoSlide(); // ❗️ Stop auto-slide when component is destroyed
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // ✅ Load Good Feedbacks (Rating > 3)
  loadGoodFeedbacks() {
    this.userService.getFeedbackRating().subscribe({
      next: (res: any) => {
        this.feedbacks = res;
        console.log('Loaded Feedbacks:', this.feedbacks);
      },
      error: (err) => {
        console.error('Error fetching good feedbacks', err);
      },
    });
  }

  // 📅 Format Date for Display
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // ⏩ Go to Next Slide
  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.feedbacks.length;
  }

  // ⏪ Go to Previous Slide
  prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.feedbacks.length) % this.feedbacks.length;
  }

  // 🎥 Start Auto-slide (Every 5 Seconds)
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  // ⏹️ Stop Auto-slide
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }
}
