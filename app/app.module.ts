import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component'
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DynamicScriptLoaderService } from './shared/services/dynamic-script-loader.service';
import { ConfigService } from './shared/services/config.service';
import { RightSidebarService } from './shared/services/rightsidebar.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskModule } from 'ngx-mask';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClickOutsideModule } from 'ng-click-outside';
import { HttpClientModule } from '@angular/common/http';
import { LandingPageComponent } from './landing/landing-page/landing-page.component';

import { HomePageComponent } from './petsocial/comps/home-page/home-page.component';
import { SignInComponent } from './petsocial/comps/sign-in/sign-in.component';
import { ProfilePageComponent } from './petsocial/comps/profile-page/profile-page.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreatePostComponent } from './petsocial/comps/create-post/create-post.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RightSidebarComponent,
    PageLoaderComponent,
    SidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    LandingPageComponent,
    HomePageComponent,
    SignInComponent,
    ProfilePageComponent,
    CreatePostComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonToggleModule,
    ClickOutsideModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    DynamicScriptLoaderService,
    ConfigService,
    RightSidebarService,
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
