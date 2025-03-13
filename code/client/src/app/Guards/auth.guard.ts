import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastService } from 'angular-toastify';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private toast: ToastService) { }

  canActivate(): boolean {
    const role = this.userService.getRole();
    console.log('auth guard canActivate >> ' + role);

    if (this.userService.isLoggedIn()) {
      return true;
    } else {
      setTimeout(() => {
        this.toast.error("Kindly login first")
        this.router.navigate(['/auth/login']); // Redirect to login if not authenticated
      }, 1900);
      return false;
    }
  }
}

