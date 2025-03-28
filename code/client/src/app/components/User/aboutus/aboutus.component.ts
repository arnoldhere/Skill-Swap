import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../others/navbar/navbar.component';
import { FooterComponent } from '../../others/footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss',
})
export class AboutUsComponent {
  isScrolled = false;
  public communityPhoto: string = 'assets/images/about1.jpeg';
  public skillSwapPhoto: string = 'assets/images/about2.jpeg';
  public growPhoto: string = 'assets/images/about3.jpeg';

  // Features Data
  public features = [
    {
      title: 'Community Driven',
      description: 'Join a thriving community and exchange knowledge with like-minded individuals.',
      photo: this.communityPhoto,
    },
    {
      title: 'Skill Exchange',
      description: 'Swap skills and learn new talents with ease and efficiency.',
      photo: this.skillSwapPhoto,
    },
    {
      title: 'Grow Together',
      description: 'Enhance your skillset while contributing to the community’s growth.',
      photo: this.growPhoto,
    },
  ];

  // Testimonials Data
  public testimonials = [
    {
      name: 'John Doe',
      feedback: 'SkillSwap helped me improve my web development skills in no time!',
      role: 'Frontend Developer',
      photo: 'assets/images/user1.jpg',
    },
    {
      name: 'Sarah Lee',
      feedback: 'An amazing platform to exchange skills and meet like-minded people.',
      role: 'UI/UX Designer',
      photo: 'assets/images/user2.jpg',
    },
    {
      name: 'Mike Johnson',
      feedback: 'I swapped my design skills for coding knowledge and loved the experience!',
      role: 'Graphic Designer',
      photo: 'assets/images/user3.jpg',
    },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
