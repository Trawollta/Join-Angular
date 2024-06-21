import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, lastValueFrom } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/';
  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient) {
    const currentUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser ? JSON.parse(currentUser) : null);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log(`Token gefunden: ${token}`);
    } else {
      console.log('Kein Token gefunden');
    }
    return new HttpHeaders({
      'Authorization': token ? `Token ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  async register(userData: any): Promise<any> {
    try {
      const requestObservable = this.http.post(`${this.apiUrl}register/`, userData);
      return await lastValueFrom(requestObservable);
    } catch (error) {
      console.error('Registrierungsfehler:', error);
      throw error;
    }
  }

  async login(credentials: { username: string, password: string }): Promise<User> {
    try {
      const requestObservable = this.http.post<User>(`${this.apiUrl}login/`, credentials);
      const user = await lastValueFrom(requestObservable);
      if (user && user.token) {
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      return user;
    } catch (error) {
      console.error('Login-Fehler:', error);
      throw error;
    }
  }

  getCurrentUser(): Observable<User> {
    const headers = this.getHeaders();
    console.log(headers);  // Füge dies zur Überprüfung hinzu
    return this.http.get<User>(`${this.apiUrl}current_user/`, { headers });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.http.post(`${this.apiUrl}logout/`, {}, { headers: this.getHeaders() }).subscribe(
      response => {
        console.log('Logout erfolgreich', response);
      },
      error => {
        console.error('Logout Fehler', error);
      }
    );
  }

  public getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}
