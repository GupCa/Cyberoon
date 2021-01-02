import { TestBed } from '@angular/core/testing';

import { OAuth2LoginService } from './oauth2-login.service';

describe('OAuth2LoginService', () => {
  let service: OAuth2LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OAuth2LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
