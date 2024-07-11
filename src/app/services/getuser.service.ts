import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {
  private apiUrl = 'http://localhost:8000/api/auth/currentUser/';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  currentUserId = new BehaviorSubject<number>(0);
  $currentUserId = this.currentUserId.asObservable();

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  fetchCurrentUser(): void {
    console.log(this.currentUserId.value);
    this.http.get<User>(this.apiUrl+this.currentUserId.value+'/', { headers: this.getHeaders() }).subscribe(
      user => this.currentUserSubject.next(user),
      error => console.error('Fehler beim Abrufen des Benutzers:', error)
    );
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUser$;
  }
}
