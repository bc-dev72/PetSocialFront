import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing/landing-page/landing-page.component';

import { HomePageComponent } from './petsocial/comps/home-page/home-page.component';
import { SignInComponent } from './petsocial/comps/sign-in/sign-in.component';
import { ProfilePageComponent } from './petsocial/comps/profile-page/profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/landing', pathMatch: 'full' },
      {
        path: 'petsocial/home',
        component: HomePageComponent
      },
      {
        path: 'petsocial/sign',
        component: SignInComponent
      },
      {
        path: 'petsocial/profile/:username',
        component: ProfilePageComponent
      },
      {
        path: 'landing',
        component: LandingPageComponent
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
