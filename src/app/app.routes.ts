import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { NewUsersComponent } from './new-users/new-users.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
// import { AuthGuard } from './authentication/AuthGuard';
// import { NoAuthGuard } from './authentication/NoAuthGuard';
// import { ProfileComponent } from './profile/profile.component';
// import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
    // {path: '', component: HeaderComponent},
    {path: '', loadComponent: ()=> import('./header/header.component').then(m => m.HeaderComponent)},
    {path: 'about', component: AboutComponent},
    {path: 'new_users', component: NewUsersComponent},
    // {path: 'register', component: RegisterComponent, canActivate:  [NoAuthGuard]},
    // {path: 'sign_in', component: SigninComponent, canActivate:  [NoAuthGuard]},
    // {path: 'profile', loadComponent: ()=> import('./profile/profile.component').then(m => m.ProfileComponent), canActivate:  [AuthGuard]},
    {path: 'register', component: RegisterComponent},
    {path: 'sign_in', component: SigninComponent},
    {path: 'profile', loadComponent: ()=> import('./profile/profile.component').then(m => m.ProfileComponent)},
    {path: '**', redirectTo: '404'}
];