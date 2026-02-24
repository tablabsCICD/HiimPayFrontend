import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class JwtAuthService {

  private readonly tokenKey = 'authToken';

  constructor(private api:ApiService) { }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  getLoggedInUser() {
    return this.api.getLoggedInUserData();
  }
}
