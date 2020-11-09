import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { RightSidebarService } from '../../shared/services/rightsidebar.service';
import { ConfigService } from '../../shared/services/config.service';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import {AccountService} from '../../petsocial/services/account.service';
import {PostService} from '../../petsocial/services/post.service';
import {CreatePost} from '../../petsocial/classes/posts/create-post';

const document: any = window.document;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public config: any = {};
  userImg: string;
  homePage: string;
  isNavbarCollapsed = false;


  isPetSocial: boolean;
  petSocialAuthed: boolean;

  createPostError: string;
  imageUploaded: boolean;
  uploadedImg: string;
  description: string;
  createPostLoading: boolean;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private dataService: RightSidebarService,
    private configService: ConfigService,
    private router: Router,
    private accountService: AccountService,
    private modalService: NgbModal,
    private postService: PostService
  ) {
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        let url: string = val.url;

        if(url.includes("petsocial")) {
          this.isPetSocial = true;
          this.determineIfAuthed();
        } else {
          this.isPetSocial = false;
          this.petSocialAuthed = false;
        }

      }
    });
  }

  determineIfAuthed() {
    if(localStorage.getItem("token") == null) {
      this.petSocialAuthed = false;
      return;
    }


    this.accountService.isValid().subscribe((data: any) => {
      this.petSocialAuthed = true;
    },
    (err)=>{
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.petSocialAuthed = false;
    });
  }

  signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.router.navigate(["/petsocial/sign"])
  }

  viewYourPage() {
    this.router.navigate(["/petsocial/profile/"+localStorage.getItem("username")]);
  }

  goHome() {
    this.router.navigate(["/petsocial/home"]);
  }

  createPost(content) {
    this.createPostError = '';
    this.imageUploaded = false;
    this.createPostLoading = false;
    this.uploadedImg = '';
    this.description = '';
    this.modalService.open(content, { centered:true, size: 'lg', backdrop: 'static' });
  }

  getRandomImage() {
    this.createPostLoading = true;
    this.postService.getRandomDogImage().subscribe((data: any) => {
      let link = data.message;

      this.toDataURL(link, (function (dataUrl) {
        this.uploadedImg = dataUrl;
        this.imageUploaded = true;
        this.createPostLoading = false;
      }).bind(this));
    },
    (err)=>{});
  }

  toDataURL(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
              callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
  }

  createPostImageUploaded(event) {
    this.createPostLoading = true;
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.createPostError = 'Please upload a image file';
      this.createPostLoading = false;
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.uploadedImg = reader.result;
    this.imageUploaded = true;
    this.createPostLoading = false;
  }

  savePost() {
    this.createPostError = '';
    this.createPostLoading = true;
    if(this.imageUploaded == false || this.uploadedImg == '') {
      this.createPostError = 'No image uploaded';
      this.createPostLoading = false;
      return;
    }

    if(this.description == '') {
      this.createPostError = 'Please add a description';
      this.createPostLoading = false;
      return;
    }

    let createPostRequest = new CreatePost();
    createPostRequest.image = this.uploadedImg;
    createPostRequest.desc = this.description;

    this.postService.createPost(createPostRequest).subscribe((data: any) => {
      // let link = data.message;
      this.createPostLoading = false;
      this.modalService.dismissAll();
      this.router.navigate(["/petsocial/profile/"+localStorage.getItem("username")]);
    },
    (error)=>{
      if(error.status == 401) {
        this.createPostError = "You need to be logged in to do that";
        this.createPostLoading = false;
      } else if(error.status == 400){
        this.createPostError = error.error.response;
        this.createPostLoading = false;
      } else {
        this.createPostError = "An unexpected error occurred";
        this.createPostLoading = false;
      }
    });
  }

  ngOnInit() {
    this.config = this.configService.configData;


  }



  ngAfterViewInit() {
    // set theme on startup
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(this.document.body, localStorage.getItem('theme'));
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }

    if (localStorage.getItem('menuOption')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menuOption')
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'menu_' + this.config.layout.sidebar.backgroundColor
      );
    }

    if (localStorage.getItem('choose_logoheader')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_logoheader')
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'logo-' + this.config.layout.logo_bg_color
      );
    }

    if (localStorage.getItem('sidebar_status')) {
      if (localStorage.getItem('sidebar_status') === 'close') {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      } else {
        this.renderer.removeClass(this.document.body, 'side-closed');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.document.body, 'side-closed');
        this.renderer.addClass(this.document.body, 'submenu-closed');
      }
    }
  }

  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  public toggleRightSidebar(): void {
    this.dataService.changeMsg(
      (this.dataService.currentStatus._isScalar = !this.dataService
        .currentStatus._isScalar)
    );
  }
}
