import { Routes } from '@angular/router';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AuthGuard } from './Guards/auth.guard';



export const routes: Routes = [
  // Wildcard route for 404 Page Not Found
  // { path: '**', component: PagenotfoundComponent },
  /***** Common routes *****/
  { path: "", redirectTo: "/Home", pathMatch: 'full' },
  { path: "aboutus", loadComponent: () => import("./components/User/aboutus/aboutus.component").then(c => c.AboutUsComponent) },
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
  /***** User routes (Restricted to 'user' role) *****/
  {
    path: "user",
    children: [
      {
        path: "profile",
        loadComponent: () => import("./components/User/profile/profile.component").then(c => c.ProfileComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] },// Only users can access
      },
      {
        path: "contact",
        loadComponent: () => import("./components/User/contactus/contactus.component").then(c => c.ContactUsComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] }, // Only users can access
      },
      {
        path: "edit-personal-details",
        loadComponent: () => import("./components/User/profile/personal-info/personal-info.component").then(c => c.PersonalInfoComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      },
      {
        path: "explore",
        loadComponent: () => import("./components/User/explore/explore.component").then(c => c.ExploreComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      },
      {
        path: "add-skills",
        loadComponent: () => import("./components/User/add-skills/add-skills.component").then(c => c.AddSkillsComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      },
      {
        path: 'user-details/:id',
        loadComponent: () => import("./components/others/user-details/user-details.component").then(c => c.UserDetailsComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      },
      {
        path: 'browse-skill/:id',
        loadComponent: () => import("./components/User/browse-skill/browse-skill.component").then(c => c.BrowseSkillComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      },
      {
        path: 'edit-skill/:id',
        loadComponent: () => import("./components/User/edit-skills/edit-skills.component").then(c => c.EditSkillsComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      },
      {
        path: 'book/:swapperId/:skillId',
        loadComponent: () => import("./components/User/booking-request/booking-request.component").then(c => c.BookingRequestComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      },
      {
        path: 'chat/:senderId/:receiverId',
        loadComponent: () => import("./components/User/chat/chat.component").then(c => c.ChatComponent),
        canActivate: [AuthGuard],
        data: { roles: ['user'] } // Only users can access
      }
    ]
  },

  /***** Admin routes (Restricted to 'admin' role) *****/
  {
    path: "admin",
    children: [
      {
        path: "dashboard",
        loadComponent: () => import("./components/admin/dashboard/dashboard.component").then(c => c.DashboardComponent),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] } // Only admins can access
      },
      {
        path: "users",
        loadComponent: () => import("./components/admin/users/users.component").then(c => c.UsersComponent),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] } // Only admins can access
      },
      {
        path: "profile",
        loadComponent: () => import("./components/admin/profile/profile.component").then(c => c.ProfileComponent),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] } // Only admins can access
      },
      {
        path: "skill-categories",
        loadComponent: () => import("./components/admin/skill-category/skill-category.component").then(c => c.SkillCategoryComponent),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] } // Only admins can access
      },
      {
        path: "edit-skill-category/:id",
        loadComponent: () => import("./components/admin/others/edit-skill-category/edit-skill-category.component").then(c => c.EditSkillCategoryComponent),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] } // Only admins can access
      }
    ]
  },
];
