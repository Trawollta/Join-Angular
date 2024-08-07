import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8000/api/auth/';

  constructor(private http: HttpClient) {}

  getUsersByIds(ids: number[]): Observable<User[]> {
    const url = `${this.apiUrl}usersByIds`;
    return this.http.post<User[]>(url, { ids });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}current_user/`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.http.post(`${this.apiUrl}logout/`, {}).subscribe();
  }
}
