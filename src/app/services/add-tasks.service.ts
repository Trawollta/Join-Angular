import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Task } from '../../app/models/tasks';
import { Contact } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  private apiUrl = 'http://localhost:8000/tasks/';
  private usersUrl = 'http://localhost:8000/users/';

  constructor(public http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  newTask(taskData: Task): Promise<any> {
    const url = `${this.apiUrl}createTask/`;
    return lastValueFrom(this.http.post(url, taskData, { headers: this.getHeaders() }));
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}getTasks/`, { headers: this.getHeaders() });
  } 

  deleteTask(taskId: number): Observable<any> {
    console.log(`Attempting to delete task with id: ${taskId}`);
    const url = `${this.apiUrl}deleteTask/?task_id=${taskId}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }

  updateTask(task: Task): Observable<any> {
    const url = `${this.apiUrl}updateTask/${task.id}/`;
    return this.http.put(url, task, { headers: this.getHeaders() });
  }

  getUsers(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.usersUrl, { headers: this.getHeaders() });
  }

  getUserById(userId: number): Observable<Contact> {
    debugger;
    const url = `${this.usersUrl}${userId}/`;
    return this.http.get<Contact>(url, { headers: this.getHeaders() });
  }
}
