export const authInfo: OAuth2 = {
  responseType: 'code',
  scope: 'user_info',
  clientId: 'web-client',
  redirectUri: 'http://localhost:8081/',
  grantType: 'authorization_code',
  clientSecret: 'admin'
};

interface OAuth2 {
  responseType: string;
  scope: string;
  clientId: string;
  redirectUri: string;
  grantType: string;
  clientSecret: string;
}
