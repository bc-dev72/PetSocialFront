import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  signIn(request) {
    return this.http.post<any>(this.baseUrl+"/auth/signin", request,
      {headers: this.postHeader()});
  }

  signUp(request) {
    return this.http.post<any>(this.baseUrl+"/auth/signup", request,
      {headers: this.postHeader()});
  }

  isValid() {
    return this.http.get<any>(this.baseUrl+"/api/isvalid",
      {headers: this.postHeader()});
  }

  getProfileSummary(username) {
    return this.http.get<any>(this.baseUrl+"/public/profile/"+username+"/getsummary",
      {headers: this.postHeader()});
  }

  followUser(username) {
    return this.http.get<any>(this.baseUrl+"/api/follow/"+username,
      {headers: this.postHeader()});
  }

  unfollowUser(username) {
    return this.http.get<any>(this.baseUrl+"/api/unfollow/"+username,
      {headers: this.postHeader()});
  }

  updateProfile(request) {
    return this.http.post<any>(this.baseUrl+"/api/updateprofile", request,
      {headers: this.postHeader()});
  }

  postHeader() {
    let tokenHeader = 'Bearer ' + localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', tokenHeader)
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

}
