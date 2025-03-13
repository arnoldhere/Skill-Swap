import { Routes } from '@angular/router';



export const routes: Routes = [
  { path: "", redirectTo: "/Home", pathMatch: 'full' },
  // { path: "***", loadComponent:()=> import ("./others/") },
  {
    path: 'Home',
    loadComponent: () =>
      import('./User/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: "user",
    children: [
      {
        path: "profile",
        loadComponent: () => import("./User/profile/profile.component").then(c => c.ProfileComponent),
      }
    ]
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        loadComponent: () => import("./auth/login/login.component").then(c => c.LoginComponent),
      },
      {
        path: "signup",
        loadComponent: () => import("./auth/signup/signup.component").then(c => c.SignupComponent),
      },
      {
        path: 'Auth/Google/Success',
        loadComponent: () =>
          import('./auth/google-auth-callback/google-auth-callback.component').then(c => c.GoogleAuthCallbackComponent),
      },

      {
        path: 'Forgotpsw',
        loadComponent: () =>
          import('./auth/forgotpsw/forgotpsw.component').then(c => c.ForgotpswComponent),
      },
      {
        path: 'verifyotp',
        loadComponent: () =>
          import('./auth/verifyotp/verifyotp.component').then(c => c.VerifyotpComponent),
      },
      {
        path: 'changepassword',
        loadComponent: () =>
          import('./auth/changepassword/changepassword.component').then(c => c.ChangepasswordComponent),
      }
    ]
  },




];
