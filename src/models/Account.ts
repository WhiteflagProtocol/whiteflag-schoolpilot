export class Account {
  public id: number = 0;
  public username: string;
  public password: string;
  public email: string;

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}
