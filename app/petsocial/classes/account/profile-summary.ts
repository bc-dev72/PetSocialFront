export class ProfileSummary {
  public bio: string;
  public profilePicture: string;
  public totalFavorites: number;
  public totalFollowers: number;
  public totalFollowing: number;
  public following: boolean;
  public authedUser: boolean;
  constructor() {
    this.bio = '';
    this.profilePicture = '';
    this.totalFavorites = 0;
    this.totalFollowers = 0;
    this.totalFollowing = 0;
    this.following = false;
    this.authedUser = false;
  }
}
