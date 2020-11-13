import { Component, OnInit, HostListener} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import {PostService} from '../../services/post.service';
import {AccountService} from '../../services/account.service';

import {SearchPost} from '../../classes/posts/search-post';
import {FavoriteRequest} from '../../classes/posts/favorite-request';
import {VoteRequest} from '../../classes/posts/vote-request';
import {CommentRequest} from '../../classes/posts/comment-request';
import {ProfileSummary} from '../../classes/account/profile-summary';

import {UpdateProfileRequest} from '../../classes/account/update-profile-request';
import {UpdateProfileResponse} from '../../classes/account/update-profile-response';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.sass']
})
export class ProfilePageComponent implements OnInit {

  sub: any;

  favoritesToggle: boolean;

  //profile summary
  profileSummaryLoading: boolean;
  profileSummaryFailed: boolean;
  profileSummaryLoadError: string;
  profileSummary: ProfileSummary;


  loading: boolean;
  gettingNewPage: boolean;
  noMoreResults: boolean;

  username: string;
  results: SearchPost[];
  currentPage: number;

  canDelete: boolean;

  currentModalIndex: number;
  canMakeComments: boolean;
  commentPlaceholder: string;

  updateProfileLoading: boolean;
  updateProfileError: string;
  profileBio: string;
  profileImage: string;
  profileImageUploaded: boolean;

  constructor(private route: ActivatedRoute, private postService: PostService, private modalService: NgbModal, private accountService: AccountService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
       this.username = params['username'];
       this.init();
    },
    (err)=>{});
  }

  init() {
    this.loading = true;
    this.currentPage = 0;
    this.currentModalIndex = 0;
    this.canDelete = false;
    this.favoritesToggle = false;

    this.profileSummaryLoading = true;
    this.profileSummaryFailed = false;
    this.profileSummaryLoadError = '';

    if(localStorage.getItem("token") != null) {
      this.commentPlaceholder = "Make a comment";
      this.canMakeComments = true;

      if(localStorage.getItem("username") == this.username)
        this.canDelete = true;
    } else {
      this.commentPlaceholder = "Sign in to make comments";
      this.canMakeComments = false;
    }

    this.getProfileData();
    this.getFirstData();
  }


  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    let pos = (document.documentElement.scrollTop);
    let max = document.documentElement.scrollHeight;
    if(max-pos < 1500) {
      this.getNewPage();
    }
  }

  getProfileData() {
    this.accountService.getProfileSummary(this.username).subscribe((data: any) => {
      this.profileSummary = data;
      this.profileSummaryLoading = false;
    },
    (err)=>{
      if(err.status != 400) {
        this.profileSummaryLoadError = 'Unexpected error occurred when getting profile summary';
      } else {
        this.profileSummaryLoadError = err.error.message;
      }
      this.profileSummaryFailed = true;
      this.profileSummaryLoading = false;
    });
  }

  toggleFavorites() {
    this.favoritesToggle = !this.favoritesToggle;
    this.getFirstData();
  }

  followUser(index) {
    this.profileSummaryLoading = true;
    this.accountService.followUser(this.username).subscribe((data: any) => {
      this.profileSummary.following = true;
      this.profileSummaryLoading = false;
    },
    (err)=>{
      if(err.status == 401) {
        this.profileSummaryLoadError = "You need to be logged into to do this";
      } else if(err.status == 400){
        this.profileSummaryLoadError = err.error.message;
      } else {
        this.profileSummaryLoadError = 'Unexpected error occurred when getting profile summary';
      }
      this.profileSummaryLoading = false;
    });
  }

  unfollowUser(index) {
    this.profileSummaryLoading = true;
    this.accountService.unfollowUser(this.username).subscribe((data: any) => {
      this.profileSummary.following = false;
      this.profileSummaryLoading = false;
    },
    (err)=>{
      if(err.status == 401) {
        this.profileSummaryLoadError = "You need to be logged into to do this";
      } else if(err.status == 400){
        this.profileSummaryLoadError = err.error.message;
      } else {
        this.profileSummaryLoadError = 'Unexpected error occurred when getting profile summary';
      }
      this.profileSummaryLoading = false;
    });
  }

  getFirstData() {
    this.currentPage = 0;
    this.results = [];
    this.loading = true;

    if(this.favoritesToggle) {
      this.postService.getUserPostsFavorites(this.username, this.currentPage, "").subscribe((data: any) => {
        this.results = data;
        this.loading = false;
        console.log(this.results);
      },
      (err)=>{});
    } else {
      this.postService.getUserPosts(this.username, this.currentPage, "").subscribe((data: any) => {
        this.results = data;
        this.loading = false;
        console.log(this.results);
      },
      (err)=>{});
    }
  }

  openEditProfile(content) {
    this.updateProfileError = '';
    this.profileImage = '';
    this.profileBio = this.profileSummary.bio;
    this.updateProfileLoading = false;
    this.profileImageUploaded = false;
    this.modalService.open(content, { centered: true });
  }

  createProfileImage(event) {
    this.updateProfileLoading = true;
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.updateProfileError = 'Please upload a image file';
      this.updateProfileLoading = false;
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.profileImage = reader.result;
    this.updateProfileLoading = false;
    this.profileImageUploaded = true;
  }

  saveProfileChanges() {
    this.updateProfileLoading = true;


    let updateRequest = new UpdateProfileRequest();
    updateRequest.bio = this.profileBio;
    updateRequest.profilePicture = this.profileImage;

    this.accountService.updateProfile(updateRequest).subscribe((data: any) => {
      console.log(data);
      this.profileSummary.bio = data.bio;
      this.profileSummary.profilePicture = data.profilePicture;
      this.updateProfileLoading = false;
      this.modalService.dismissAll();
    },
    (err)=>{
      this.updateProfileError = 'An error occurred';
      this.updateProfileLoading = false;
    });

  }


  getNewPage() {
    if(this.gettingNewPage || this.noMoreResults || this.loading)
      return;
    this.gettingNewPage = true;
    this.currentPage++;

    let lastPost: string = '';
    if(this.results.length != 0)
      lastPost = this.results[this.results.length-1].postId;


    if(this.favoritesToggle) {
      this.postService.getUserPostsFavorites(this.username, this.currentPage, lastPost).subscribe((data: any) => {
        console.log(data);
        Array.prototype.push.apply(this.results, data);
        // this.results = data;
        if(data.length == 0)
          this.noMoreResults = true;
        this.gettingNewPage = false;
      },
      (err)=>{});
    } else {
      this.postService.getUserPosts(this.username, this.currentPage, lastPost).subscribe((data: any) => {
        console.log(data);
        Array.prototype.push.apply(this.results, data);
        // this.results = data;
        if(data.length == 0)
          this.noMoreResults = true;
        this.gettingNewPage = false;
      },
      (err)=>{});
    }

  }

  openPost(index, content) {
    if(this.results[index].deleted)
      return;

    console.log("Worked " + index);
    this.currentModalIndex = index;
    this.modalService.open(content, { centered: true, size: 'xl' });
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

  delete(index) {
    this.results[index].changeLoading = true;

    let postId = this.results[index].postId;

    this.postService.deletePost(postId).subscribe((data: any) => {
      // this.results[index] = data;
      this.results[index].deleted = true;
      this.results[index].changeLoading = false;
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
