import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OAuth2LoginService } from '../services/oauth2-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  readonly loginForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: ['']
  });

  get name(): string {
    return String(this.loginForm?.get('name')?.value);
  }

  get password(): string {
    return String(this.loginForm?.get('password')?.value);
  }

  get rememberMe(): boolean {
    return Boolean(this.loginForm?.get('rememberMe')?.value);
  }

  constructor(
    private fb: FormBuilder,
    private authService: OAuth2LoginService
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    console.log('onSubmit called');
    // this.loginForm.statusChanges.pipe()
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }

    this.authService.login(this.name, this.password, this.rememberMe);
  }
}
