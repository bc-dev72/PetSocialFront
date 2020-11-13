import { Component, OnInit, HostListener} from '@angular/core';

import {PostService} from '../../services/post.service';
import {AccountService} from '../../services/account.service';

import {SearchPost} from '../../classes/posts/search-post';
import {FavoriteRequest} from '../../classes/posts/favorite-request';
import {VoteRequest} from '../../classes/posts/vote-request';
import {CommentRequest} from '../../classes/posts/comment-request';

const document: any = window.document;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {

  currentPage: number;
  results: SearchPost[];
  loading: boolean;
  loadingMoreResults: boolean;

  canMakeComments: boolean;
  commentPlaceholder: string;

  gettingNewPage: boolean;
  noMoreResults: boolean;

  constructor(private postService: PostService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.currentPage = 0;
    this.results = [];
    this.loading = true;
    this.loadingMoreResults = false;
    this.noMoreResults = false;
    this.gettingNewPage = false;

    if(localStorage.getItem("token") != null) {
      this.commentPlaceholder = "Make a comment";
      this.canMakeComments = true;
    } else {
      this.commentPlaceholder = "Sign in to make comments";
      this.canMakeComments = false;
    }

    this.getPage();
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    let pos = (document.documentElement.scrollTop);
    let max = document.documentElement.scrollHeight;
    if(max-pos < 1500) {
      this.getNewPage();
    }
  }


  getNewPage() {
    if(this.gettingNewPage || this.noMoreResults || this.loading)
      return;
    this.gettingNewPage = true;
    this.currentPage++;

    let lastPost: string = '';
    if(this.results.length != 0)
      lastPost = this.results[this.results.length-1].postId;

    this.postService.getHomePage(this.currentPage, lastPost).subscribe((data: any) => {
      console.log(data);
      Array.prototype.push.apply(this.results, data);
      // this.results = data;
      if(data.length == 0)
      this.noMoreResults = true;
      this.gettingNewPage = false;
    },
    (err)=>{});
  }


  getPage() {
    this.postService.getHomePage(this.currentPage, "").subscribe((data: any) => {
      this.results = data;
      console.log(this.results);
      this.loading = false;
    },
    (err)=>{});
  }

  upvote(index) {
    this.results[index].changeLoading = true;
    let choice = 1;
    if(this.results[index].currentVote == 1)
      choice = 0;

    let postId = this.results[index].postId;
    let request = new VoteRequest();
    request.value = choice;

    this.postService.vote(postId, request).subscribe((data: any) => {
      this.results[index] = data;
    },
    (err)=>{this.updatePostError(index, err);});
  }

  downvote(index) {
    this.results[index].changeLoading = true;
    let choice = -1;
    if(this.results[index].currentVote == -1)
      choice = 0;

    let postId = this.results[index].postId;
    let request = new VoteRequest();
    request.value = choice;

    this.postService.vote(postId, request).subscribe((data: any) => {
      this.results[index] = data;
    },
    (err)=>{this.updatePostError(index, err);});
  }

  favorite(index) {
    this.results[index].changeLoading = true;
    let choice = !this.results[index].favorited;

    let postId = this.results[index].postId;
    let request = new FavoriteRequest();
    request.favorite = choice;

    this.postService.favorite(postId, request).subscribe((data: any) => {
      this.results[index] = data;
    },
    (err)=>{this.updatePostError(index, err);});
  }

  comment(index) {
    this.results[index].changeLoading = true;

    let postId = this.results[index].postId;
    let request = new CommentRequest();
    request.comment = this.results[index].currentComment;

    this.postService.comment(postId, request).subscribe((data: any) => {
      this.results[index] = data;
    },
    (err)=>{this.updatePostError(index, err);});
  }

  viewAllComments(index) {
    this.results[index].viewAllComments = true;
  }

  followUser(index) {
    this.accountService.followUser(this.results[index].username).subscribe((data: any) => {
      this.results[index].following = true;
    },
    (err)=>{this.updatePostError(index, err);});
  }

  unfollowUser(index) {
    this.accountService.unfollowUser(this.results[index].username).subscribe((data: any) => {
      this.results[index].following = false;
    },
    (err)=>{this.updatePostError(index, err);});
  }


  updatePostError(index, error) {
    if(error.status == 401) {
      this.results[index].error = "You need to be logged in to do that";
      this.results[index].changeLoading = false;
    } else {
      this.results[index].error = "An unexpected error occurred";
      this.results[index].changeLoading = false;
    }
  }


}
