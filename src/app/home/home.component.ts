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

  async login(): Promise<void> {
    const formData = new FormData();
    formData.append('username', 'admin');
    formData.append('password', 'admin');
    this.oAuthService.post('http://localhost:8080/auth/login', formData);

    let url = `${environment.authApiUrl}/authorize?`;
    const [
      challenge,
      verifier
    ] = await this.oAuthService.createChallengeVerifierPairForPKCE();
    localStorage.setItem('PKCE_verifier', verifier);

    url += `response_type=${authInfo.responseType}`;
    url += `&scope=${authInfo.scope}`;
    // url += `&state=${authInfo.scope}`;
    url += `&client_id=${authInfo.clientId}`;
    url += `&redirect_uri=${authInfo.redirectUri}`;
    // url += `&nonce=${authInfo.redirectUri}`;
    url += `&code_challenge=${challenge}`;
    url += '&code_challenge_method=S256';
    window.location.href = url;
    // this.oAuthService.get(url);
  }

  logout(): void {
    this.oAuthService.logout();
  }
}
