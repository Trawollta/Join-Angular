import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8000/api/auth/'; // Angepasste Basis-URL deines Django-Servers

  constructor(private http: HttpClient) {
  }

  

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Token df7d37e61d77cda79d2c12ef5f0b8fc9186bc1fb',
      'Content-Type': 'application/json'
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}current_user/`, { headers: this.getHeaders() }); // Endpunkt für aktuellen Benutzer
  }


  logout(): void {
    // Entferne den Token aus dem lokalen Speicher
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    // Optional: Sende eine Anfrage an das Backend, um den Token ungültig zu machen
    this.http.post(`${this.apiUrl}logout/`, {}, { headers: this.getHeaders() }).subscribe(
      response => {
        console.log('Logout erfolgreich', response);
      },
      error => {
        console.error('Logout Fehler', error);
      }
    );
  }

}
