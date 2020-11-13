export class UpdateProfileRequest {
    public profilePicture: string;
    public bio: string;

    constructor() {
      this.profilePicture = '';
      this.bio = '';
    }
}
