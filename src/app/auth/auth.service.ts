import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/users';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post(this.baseUrl + '/auth/signin', user, httpOptions);
  }

  register(user: User): Observable<any> {
    return this.http.post(this.baseUrl + '/auth/signup', user, this.httpOptions);
  }
}