import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../app/models/tasks';
import { Contact } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  private apiUrl = 'http://localhost:8000/tasks/';
  private usersUrl = 'http://localhost:8000/users/';

  constructor(public http: HttpClient) {}

  newTask(taskData: Task): Observable<any> {
    const url = `${this.apiUrl}createTask/`;
    return this.http.post(url, taskData);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}getTasks/`);
  }

  deleteTask(taskId: number): Observable<any> {
    const url = `${this.apiUrl}deleteTask/?task_id=${taskId}`;
    return this.http.delete(url);
  }

  updateTask(task: Task): Observable<any> {
    const url = `${this.apiUrl}updateTask/${task.id}/`;
    return this.http.put(url, task);
  }

  getUsers(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.usersUrl);
  }

  getUserById(userId: number): Observable<Contact> {
    const url = `${this.usersUrl}${userId}/`;
    return this.http.get<Contact>(url);
  }
}
