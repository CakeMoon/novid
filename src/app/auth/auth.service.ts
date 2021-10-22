import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './user';
import { environment } from "../../environments/environment";
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  isLoggedIn$ = new BehaviorSubject(false);
  username$ = new BehaviorSubject('');

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
  ) { 
    if (!!this.tokenStorageService.getToken()) {
      this.isLoggedIn$.next(true);
    }
  }

  login(user: User): Observable<any> {
    return this.http.post(
      [this.baseUrl, 'users', 'auth', 'signin'].join('/'),
      user, 
      this.httpOptions);
  }

  register(user: User): Observable<any> {
    return this.http.post(
      [this.baseUrl, 'users', 'auth', 'signup'].join('/'),
      user, 
      this.httpOptions);
  }

  claim(authcode: string, bid: number): Observable<any>  {
    return this.http.post(
      [this.baseUrl, 'businesses', bid, 'owner'].join('/'),
      { authcode: authcode }, 
      this.httpOptions);
  }
}