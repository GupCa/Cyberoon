import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { authInfo } from '../services/oauth.model';
import { OAuth2LoginService } from '../services/oauth2-login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public isLoggedIn = false;
  constructor(
    private oAuthService: OAuth2LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.oAuthService.checkCredentials();
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (!this.isLoggedIn && code) {
        this.oAuthService.retrieveToken(code);
      }
    });
  }

  login(): void {
    window.location.href = `${environment.authApiUrl}/authorize?response_type=${authInfo.responseType}&scope=${authInfo.scope}&client_id=${authInfo.clientId}&redirect_uri=${authInfo.redirectUri}`;
  }

  logout(): void {
    this.oAuthService.logout();
  }
}
