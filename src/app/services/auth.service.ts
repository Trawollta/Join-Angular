import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, lastValueFrom } from 'rxjs';
import { User, GuestUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/';
  private currentUserSubject: BehaviorSubject<User | GuestUser | null>;
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    const currentUserString = localStorage.getItem('currentUser');
    let currentUser: User | GuestUser | null = null;
    if (currentUserString) {
      try {
        currentUser = JSON.parse(currentUserString);
      } catch (error) {
        console.error('Fehler beim Parsen des aktuellen Benutzers:', error);
        currentUser = null;
      }
    }
    this.currentUserSubject = new BehaviorSubject<User | GuestUser | null>(currentUser);
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
      const refreshToken = response.refresh;
      if (token && refreshToken) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        const currentUser = await lastValueFrom(this.getCurrentUser());
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
        this.loggedIn.next(true);
      }
    } catch (error) {
      console.error('Login-Fehler:', error);
      throw error;
    }
  }

  guestLogin(): void {
    // Setze den Gastbenutzer
    const guestUser: GuestUser = { id: null, username: 'Gast' };
    this.currentUserSubject.next(guestUser);
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    this.loggedIn.next(true);
  }

  getCurrentUser(): Observable<User | GuestUser | null> {
    const token = localStorage.getItem('authToken');
    if (token) {
      const headers = this.getHeaders();
      return this.http.get<User>(`${this.apiUrl}current_user/`, { headers });
    } else {
      return of(this.currentUserSubject.value);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('authToken');
  
    if (refreshToken && accessToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });
  
      const body = { refresh: refreshToken };
  
      this.http.post(`${this.apiUrl}logout/`, body, { headers }).subscribe(
        response => {
          console.log('Logout erfolgreich', response);
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('refreshToken');
          this.currentUserSubject.next(null);
          this.loggedIn.next(false);
        },
        error => {
          console.error('Logout Fehler', error);
        }
      );
    } else {
      console.error('Kein Refresh-Token oder Access-Token gefunden');
    }
  }

  public getCurrentUserObservable(): Observable<User | GuestUser | null> {
    return this.currentUserSubject.asObservable();
  }
}
