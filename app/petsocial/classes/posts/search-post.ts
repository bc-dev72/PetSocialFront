export class SearchPost {
  public postId: string;
  public username: string;
  public dateString: string;

  public desc: string;
  public image: string;

  public favorited: boolean;
  public voteCount: number;
  public totalFavorites: number;
  public currentVote: number;

  public currentComment: string;
  public error: string;
  public changeLoading: boolean;

  public viewAllComments: boolean;
  public deleted: boolean;


  constructor() {
    this.postId = '';
    this.username = '';
    this.dateString = '';
    this.desc = '';
    this.image = '';
    this.favorited = false;
    this.voteCount = 0;
    this.totalFavorites = 0;
    this.currentComment = '';
    this.changeLoading = false;
    this.error = '';
    this.viewAllComments = false;
    this.currentVote = 0;
    this.deleted = false;
  }

}
