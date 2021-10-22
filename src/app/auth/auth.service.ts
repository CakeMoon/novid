import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  isLoggedIn$ = new BehaviorSubject(false);
  username$ = new BehaviorSubject('');

  constructor(private http: HttpClient) { }

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