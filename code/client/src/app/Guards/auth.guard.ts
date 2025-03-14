import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastService } from 'angular-toastify';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private toast: ToastService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.userService.getRole() || "";
    console.log('auth guard  >> Role :  ' + role);

    if (!this.userService.isLoggedIn()) {
      this.toast.error("Kindly login first");
      this.router.navigate(['/auth/login']);
      return false;
    }


    // Role-based route restriction
    if (route.data['roles'] && !route.data['roles'].includes(role)) {
      this.toast.warn("You do not have permission to access this page.");
      this.redirectBasedOnRole(role);
      return false;
    }

    return true;
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'user') {
      this.router.navigate(['/Home']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}

