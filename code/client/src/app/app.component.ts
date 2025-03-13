import { ɵBrowserAnimationBuilder } from '@angular/animations';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AngularToastifyModule } from 'angular-toastify';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularToastifyModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SkillSwap';
}
