import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastService } from 'angular-toastify';
import { CustomToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private toast: CustomToastService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.userService.getRole() || "";
    console.log('auth guard  >> Role :  ' + role);

    if (this.userService.isLoggedIn() === false) {
      this.toast.error("Kindly login first");
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2100);
      return false;
    }


    // Role-based route restriction
    if (route.data['roles'] && !route.data['roles'].includes(role)) {
      this.toast.warning("You do not have permission to access this page.");
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

