import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

import { base64UrlEncode } from './base64-helper';
import { HashHandler } from './hash-handler';
import { authInfo } from './oauth.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiUrl = '//localhost:8080/auth';

@Injectable({
  providedIn: 'root'
})
export class OAuth2LoginService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    protected crypto: HashHandler
  ) {}

  login(username: string, password: string, rememberMe: boolean): void {
    console.log('login post called');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('remember-me', rememberMe ? 'on' : 'off');

    this.http
      .post(`${apiUrl}/login`, formData, {
        observe: 'response' as 'body'
      })
      .subscribe(
        (data) => {
          console.log('success');
          console.log(data);
        },
        /*(err: HttpErrorResponse) => {
          if (err.url) {
            console.warn(`REDIRECTING MANUALLY TO ${err.url}`);

            window.location.replace(err.url);
          }
          console.log('error');
          console.log(err);
        }*/
      );
  }

  retrieveToken(code: unknown): void {
    const params = new URLSearchParams();
    params.append('grant_type', authInfo.grantType);
    params.append('client_id', authInfo.clientId);
    params.append('client_secret', authInfo.clientSecret);
    params.append('redirect_uri', authInfo.redirectUri);
    params.append('code_verifier', localStorage.getItem('PKCE_verifier'));
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
    // this.http
    //   .get(`http://my-test-auth-server.herokuapp.com/auth/logout`)
    //   .subscribe(
    //     (data) => console.log(data),
    //     (err) => console.log(err)
    //   );
    location.href = 'http://localhost:8080/auth/logout';
  }

  get(url: string) {
    return this.http.get(url).subscribe(
      (data) => console.log(data),
      (err) => console.log(err)
    );
  }

  post(url: string, body: any, options?: any) {
    return this.http.post(url, body, options).subscribe(
      (data) => console.log(data),
      (err) => console.log(err)
    );
  }

  async createChallengeVerifierPairForPKCE(): Promise<[string, string]> {
    if (!this.crypto) {
      throw new Error(
        'PKCE support for code flow needs a CryptoHander. Did you import the OAuthModule using forRoot() ?'
      );
    }

    const verifier = this.createNonce();
    const challengeRaw = await this.crypto.calcHash(verifier, 'sha-256');
    const challenge = base64UrlEncode(challengeRaw);

    return [challenge, verifier];
  }

  createNonce() {
    /*
     * This alphabet is from:
     * https://tools.ietf.org/html/rfc7636#section-4.1
     *
     * [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
     */
    const unreserved =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let size = 45;
    let id = '';

    const crypto =
      typeof self === 'undefined' ? null : self.crypto || self['msCrypto'];
    if (crypto) {
      let bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);

      // Needed for IE
      if (!bytes.map) {
        (bytes as any).map = Array.prototype.map;
      }

      bytes = bytes.map((x) => unreserved.charCodeAt(x % unreserved.length));
      id = String.fromCharCode.apply(null, bytes);
    } else {
      while (0 < size--) {
        id += unreserved[(Math.random() * unreserved.length) | 0];
      }
    }

    return base64UrlEncode(id);
  }
}
