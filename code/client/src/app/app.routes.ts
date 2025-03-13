import { Routes } from '@angular/router';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AuthGuard } from './Guards/auth.guard';



export const routes: Routes = [
  // Wildcard route for 404 Page Not Found
  // { path: '**', component: PagenotfoundComponent },
  /***** Common routes *****/
  { path: "", redirectTo: "/Home", pathMatch: 'full' },
  {
    path: 'Home',
    loadComponent: () =>
      import('./components/User/home/home.component').then(c => c.HomeComponent),
  },

  /***** Auth routes *****/
  {
    path: "auth",
    children: [
      {
        path: "login",
        loadComponent: () => import("./components/auth/login/login.component").then(c => c.LoginComponent),
      },
      {
        path: "signup",
        loadComponent: () => import("./components/auth/signup/signup.component").then(c => c.SignupComponent),
      },
      {
        path: 'Auth/Google/Success',
        loadComponent: () =>
          import('./components/auth/google-auth-callback/google-auth-callback.component').then(c => c.GoogleAuthCallbackComponent),
      },

      {
        path: 'Forgotpsw',
        loadComponent: () =>
          import('./components/auth/forgotpsw/forgotpsw.component').then(c => c.ForgotpswComponent),
      },
      {
        path: 'verifyotp',
        loadComponent: () =>
          import('./components/auth/verifyotp/verifyotp.component').then(c => c.VerifyotpComponent),
      },
      {
        path: 'changepassword',
        loadComponent: () =>
          import('./components/auth/changepassword/changepassword.component').then(c => c.ChangepasswordComponent),
      }
    ]
  },
  /***** User routes *****/
  {
    path: "user",
    children: [
      {
        path: "profile",
        loadComponent: () => import("./components/User/profile/profile.component").then(c => c.ProfileComponent),
        canActivate: [AuthGuard]
      }
    ]
  },
  /***** Admin routes *****/
  {
    path: "admin",
    children: [
      {
        path: "dashboard",
        loadComponent: () => import("./components/admin/dashboard/dashboard.component").then(c => c.DashboardComponent),
        canActivate: [AuthGuard]
      }
    ]
  },




];
