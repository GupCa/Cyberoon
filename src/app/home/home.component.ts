import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { authInfo } from '../services/oauth.model';
import { OAuth2LoginService } from '../services/oauth2-login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public isLoggedIn = false;
  constructor(
    private service: OAuth2LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.service.checkCredentials();
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (!this.isLoggedIn && code) {
        this.service.retrieveToken(code);
      }
    });
  }

  login(): void {
    window.location.href = `http://localhost:8080/auth/oauth/authorize?response_type=code&scope=user_info&client_id=${authInfo.clientId}&redirect_uri=${authInfo.redirectUri}`;
  }

  logout(): void {
    this.service.logout();
  }
}
