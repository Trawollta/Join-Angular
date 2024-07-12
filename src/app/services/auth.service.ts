import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { GetUserService } from './getuser.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/';
  private currentUserSubject: BehaviorSubject<User | null>;
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router, private getUserService: GetUserService) {
    
    const currentUserString = localStorage.getItem('currentUser_id');
    let currentUser: User | null = null as User | null;
    if (currentUserString) {
      try {
        this.getUserService.currentUserId.next(Number(currentUserString));
        currentUser = JSON.parse(currentUserString);
      } catch (error) {
        console.error('Fehler beim Parsen des aktuellen Benutzers:', error);
        currentUser = null;
      }
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
  }

  async login(credentials: { username: string, password: string }): Promise<void> {
    try {
      const response: any = await lastValueFrom(this.http.post(`${this.apiUrl}login/`, credentials));
      this.getUserService.currentUserId.next(response.user_id);
      localStorage.setItem('currentUser_id', JSON.stringify(response.user_id));
      const token = response.token;
      if (token) {
        localStorage.setItem('authToken', token);
        this.loggedIn.next(true);
        // console.log(response.user_id);
      } else {
        console.error('Kein Token im Login-Antwort erhalten');
      }
    } catch (error) {
      console.error('Login-Fehler:', error);
      throw error;
    }
  }

  logout(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      const headers = this.getUserService.getHeaders();
      this.http.post(`${this.apiUrl}logout/`, {}, { headers }).subscribe(
        response => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          this.loggedIn.next(false);
        },
        error => {
          console.error('Logout Fehler', error);
        }
      );
    } else {
      console.error('Kein Token gefunden');
    }
  }

  public getCurrentUserObservable() {
    return this.currentUserSubject.asObservable();
  }

  async register(userData: any): Promise<any> {
    try {
      return await lastValueFrom(this.http.post(`${this.apiUrl}register/`, userData));
    } catch (error) {
      console.error('Registrierungs-Fehler:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (token === null) {
      return false;
    }
    return true;
  }
}
