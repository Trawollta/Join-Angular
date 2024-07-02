import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {
  private apiUrl = 'http://localhost:8000/api/auth/current_user/';

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      console.log('Setze Token im Header:', token); // Debug-Ausgabe
      headers = headers.set('Authorization', `${token}`); // Kein 'Bearer' Präfix
    }
    return headers;
  }

  getCurrentUser(){
    // const headers = this.getHeaders();
    // return this.http.get<User>(this.apiUrl, { headers });
    const token = localStorage.getItem('authToken');

    return lastValueFrom(this.http.post(this.apiUrl, {token}))
  }

}
