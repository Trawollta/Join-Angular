import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8000/api/auth/'; // Angepasste Basis-URL deines Django-Servers

  constructor(private http: HttpClient) {}

  getUsersByIds(ids: number[]): Observable<User[]> {
    const url = `${this.apiUrl}usersByIds`;
    return this.http.post<User[]>(url, { ids });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}current_user/`); // Endpunkt für aktuellen Benutzer
  }

  logout(): void {
    // Entferne den Token aus dem lokalen Speicher
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    // Optional: Sende eine Anfrage an das Backend, um den Token ungültig zu machen
    this.http.post(`${this.apiUrl}logout/`, {}).subscribe(
      response => {
        console.log('Logout erfolgreich', response);
      },
      error => {
        console.error('Logout Fehler', error);
      }
    );
  }
}
