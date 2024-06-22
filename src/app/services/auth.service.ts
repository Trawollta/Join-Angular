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
    const currentUserString = localStorage.getItem('currentUser');
    let currentUser: User | null = null;
    if (currentUserString) {
      try {
        currentUser = JSON.parse(currentUserString);
      } catch (error) {
        console.error('Fehler beim Parsen des aktuellen Benutzers:', error);
        currentUser = null;
      }
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
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

  async login(credentials: { username: string, password: string }): Promise<void> {
    try {
      const response: any = await lastValueFrom(this.http.post(`${this.apiUrl}login/`, credentials));
      const token = response.access;
      if (token) {
        localStorage.setItem('authToken', token);
        const currentUser = await lastValueFrom(this.getCurrentUser());
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
      }
    } catch (error) {
      console.error('Login-Fehler:', error);
      throw error;
    }
  }

  getCurrentUser(): Observable<User> {
    const headers = this.getHeaders();
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
