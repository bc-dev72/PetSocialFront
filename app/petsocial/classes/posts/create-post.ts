export class CreatePost {
  public desc: string;
  public image: string;
  public randomImage: boolean;
  constructor() {
    this.desc = '';
    this.image = '';
    this.randomImage = false;
  }
}
