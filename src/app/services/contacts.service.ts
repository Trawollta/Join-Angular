import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = 'http://localhost:8000/api/contacts/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}create/`, contact, { headers: this.getHeaders() });
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}${contact.id}/`, contact, { headers: this.getHeaders() });
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}delete/${id}/`, { headers: this.getHeaders() });
  }

  // Diese Methode wird benötigt, um für eine gegebene User-ID die vollständigen Daten abzurufen
  getUserById(userId: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}${userId}/`, { headers: this.getHeaders() });
  }
}
