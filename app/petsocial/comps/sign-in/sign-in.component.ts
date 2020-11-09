import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import {AccountService} from '../../services/account.service';
import {SignInRequest} from '../../classes/account/sign-in-request';
import {SignUpRequest} from '../../classes/account/sign-up-request';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  pageType: string;

  email: string;
  password: string;

  signUpUsername: string;
  signUpEmail: string;
  signUpPassword: string;
  signUpConfirmPassword: string;

  signInError: string;
  signUpError: string;

  loading: boolean;

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.email = '';
    this.password = '';

    this.signUpUsername = '';
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.signUpConfirmPassword = '';

    this.signUpError = '';
    this.signInError = '';

    this.loading = false;

    this.pageType = 'SignIn';

    this.route.queryParams.subscribe(params => {
      let param: string = params['type'];
      if(param != null) {
        if(param == 'in')
          this.pageType = 'SignIn';
        else if(param == 'up')
          this.pageType = 'SignUp';
      }
    });


  }

  signIn() {
    this.signInError = '';
    this.loading = true;

    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) == false) {
      this.signInError = "Please enter a valid email";
      this.loading = false;
      return;
    }

    if(this.password.length == 0) {
      this.signInError = "Please enter a password";
      this.loading = false;
      return;
    }


    let request = new SignInRequest();
    request.email = this.email;
    request.password = this.password;

    this.accountService.signIn(request).subscribe((data: any) => {
      let token = data.token;
      let username = data.username;
      localStorage.setItem("token",token);
      localStorage.setItem("username", username);
      this.loading = false;
      //redirect to home page
      this.router.navigate(["/petsocial/home"])
    },
    (err)=>{ this.httpError(0, err); this.loading = false;});

  }

  signUp() {
    this.loading = true;
    this.signUpError = '';

    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.signUpEmail) == false) {
      this.signUpError = "Please enter a valid email";
      this.loading = false;
      return;
    }

    if(this.signUpUsername.length <= 2) {
      this.signUpError = "Username too short";
      this.loading = false;
      return;
    }

    if(this.signUpPassword.length < 8) {
      this.signUpError = "Password too short";
      this.loading = false;
      return;
    }

    if(this.signUpPassword != this.signUpConfirmPassword) {
      this.signUpError = "Passwords do not match";
      this.loading = false;
      return;
    }

    let request = new SignUpRequest();
    request.email = this.signUpEmail;
    request.username = this.signUpUsername;
    request.password = this.signUpPassword;

    this.accountService.signUp(request).subscribe((data: any) => {
      let token = data.token;
      let username = data.username;
      localStorage.setItem("token",token);
      localStorage.setItem("username", username);
      this.loading = false;
      //redirect to home page
      this.router.navigate(["/petsocial/home"])
    },
    (err)=>{ this.httpError(0, err); this.loading = false;});



  }


  openSignUp() {
    if(this.loading)
      return;
    this.pageType="SignUp";
    this.signUpError = '';
    this.signUpUsername = '';
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.signUpConfirmPassword = '';
  }

  openSignIn() {
    if(this.loading)
      return;
    this.pageType="SignIn";
    this.signInError = '';
    this.email = '';
    this.password = '';
  }

  httpError(type, err) {

    if(err.status == 400) {
      if(type == 0)
        this.signInError = err.error.message;
      else if(type == 1)
        this.signUpError = err.error.message;
    } else {
      if(type == 0)
        this.signInError = "An unexpected error occurred";
      else if(type == 1)
        this.signUpError = "An unexpected error occurred";
    }
  }

}
