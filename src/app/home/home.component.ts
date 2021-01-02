import { Component, OnInit } from '@angular/core';

import { OAuth2LoginService } from '../services/oauth2-login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  public isLoggedIn = false;

  constructor(private service: OAuth2LoginService) {}

  ngOnInit() {
    this.isLoggedIn = this.service.checkCredentials();
    let i = window.location.href.indexOf('code');
    if (!this.isLoggedIn && i != -1) {
      this.service.retrieveToken(window.location.href.substring(i + 5));
    }
  }

  login() {
    window.location.href =
      'http://my-test-auth-server.herokuapp.com/auth/oauth/authorize?response_type=code&scope=openid%20write%20read&client_id=' +
      this.service.clientId +
      '&redirect_uri=' +
      this.service.redirectUri;
  }

  logout() {
    this.service.logout();
  }
}
