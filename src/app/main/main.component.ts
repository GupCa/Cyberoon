import { Component } from '@angular/core';

import { OAuth2LoginService } from '../services/oauth2-login.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
})
export class MainComponent {
  public foo = { id: 1, name: 'sample foo' };
  private foosUrl = 'http://localhost:8081/resource-server/api/foos/';

  constructor(private service: OAuth2LoginService) {}

  getFoo() {
    this.service.getResource(this.foosUrl + this.foo.id).subscribe(
      (data) => (this.foo = data),
      (error) => (this.foo.name = 'Error')
    );
  }
}
