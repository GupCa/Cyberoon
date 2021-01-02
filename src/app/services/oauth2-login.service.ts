import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OAuth2LoginService {
  public clientId = 'web-client';
  public redirectUri = 'http://localhost:8081';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  retrieveToken(code: unknown): void {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('client_secret', 'newClientSecret');
    params.append('redirect_uri', this.redirectUri);
    params.append('code', code.toString());

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    });

    this.http
      .post(
        'http://my-test-auth-server.herokuapp.com/auth/realms/baeldung/protocol/openid-connect/token',
        params.toString(),
        { headers }
      )
      .subscribe(
        (data) => this.saveToken(data),
        (err) => alert('Invalid Credentials')
      );
  }

  saveToken(token): void {
    const expireDate = new Date().getTime() + 1000 * token.expires_in;
    this.cookieService.set('access_token', token.access_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:8081';
  }

  getResource(resourceUrl): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Bearer ' + this.cookieService.get('access_token')
    });
    return this.http.get(resourceUrl, { headers });
  }

  checkCredentials(): boolean {
    return this.cookieService.check('access_token');
  }

  logout(): void {
    this.cookieService.delete('access_token');
    window.location.reload();
  }
}
