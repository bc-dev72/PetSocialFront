export class SignUpRequest {
  public email: string;
  public username: string;
  public password: string;
  constructor() {
    this.email = '';
    this.username = '';
    this.password = '';
  }
}
