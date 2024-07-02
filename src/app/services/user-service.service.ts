import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8000/api/auth/'; // Angepasste Basis-URL deines Django-Servers
  task: any; // Declare the 'task' property

  constructor(private http: HttpClient) {}

  getUsersByIds(ids: number[]): Observable<User[]> {
    const url = `${this.apiUrl}usersByIds`;
    return this.http.post<User[]>(url, { ids }, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': token ? `${token}` : '',
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
