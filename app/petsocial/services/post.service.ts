import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getHomePage(pageNumber, lastPost) {
    return this.http.get<any>(this.baseUrl+"/public/home?pageNumber="+pageNumber+"&lastPost="+lastPost,
      {headers: this.postHeader()});
  }

  getUserPosts(username, pageNumber, lastPost) {
    return this.http.get<any>(this.baseUrl+"/public/profile?username="+username+"&pageNumber="+pageNumber+"&lastPost="+lastPost,
      {headers: this.postHeader()});
  }

  vote(postId, request) {
    return this.http.post<any>(this.baseUrl+"/api/post/"+postId+"/vote", request,
      {headers: this.postHeader()});
  }

  favorite(postId, request) {
    return this.http.post<any>(this.baseUrl+"/api/post/"+postId+"/favorite", request,
      {headers: this.postHeader()});
  }

  comment(postId, request) {
    return this.http.post<any>(this.baseUrl+"/api/post/"+postId+"/comment", request,
      {headers: this.postHeader()});
  }

  deletePost(postId) {
    return this.http.delete<any>(this.baseUrl+"/api/deletepost/"+postId,
      {headers: this.postHeader()});
  }

  createPost(request) {
    return this.http.post<any>(this.baseUrl+"/api/createpost", request,
      {headers: this.postHeader()});
  }


  getRandomDogImage() {
    return this.http.get<any>(this.baseUrl+"https://dog.ceo/api/breeds/image/random");
  }

  getImage(link) {
    return this.http.get<any>(link);
  }


  postHeader() {
    let tokenHeader = 'Bearer ' + localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', tokenHeader)
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }
}
