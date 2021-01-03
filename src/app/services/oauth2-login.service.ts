import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

import { authInfo } from './oauth.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OAuth2LoginService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  retrieveToken(code: unknown): void {
    const params = new URLSearchParams();
    params.append('grant_type', authInfo.grantType);
    params.append('client_id', authInfo.clientId);
    params.append('client_secret', authInfo.clientSecret);
    params.append('redirect_uri', authInfo.redirectUri);
    params.append('code', code.toString());

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    });

    this.http
      .post(`${environment.authApiUrl}/token`, params.toString(), {
        headers
      })
      .subscribe(
        (data) => this.saveToken(data),
        (err) => console.log(err)
      );
  }

  saveToken(token): void {
    const expireDate = new Date().getTime() + 1000 * token.expires_in;
    this.cookieService.set('access_token', token.access_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = authInfo.redirectUri;
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
