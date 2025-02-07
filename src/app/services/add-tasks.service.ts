import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../app/models/tasks';
import { Contact } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  // Basis-URL für Tasks; beachte, dass sie mit dem Pfad in deiner Haupt-urls.py übereinstimmt
  private tasksUrl = 'http://localhost:8000/tasks/';
  private usersUrl = 'http://localhost:8000/users/';

  constructor(private http: HttpClient) {}

  // Erstelle einen neuen Task (POST an /tasks/)
  newTask(taskData: Task): Observable<any> {
    return this.http.post(this.tasksUrl, taskData);
  }

  // Hole alle Tasks (GET an /tasks/)
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  // Aktualisiere einen Task (PUT an /tasks/<id>/)
  updateTask(task: Task): Observable<any> {
    const url = `${this.tasksUrl}${task.id}/`;
    return this.http.put(url, task);
  }

  // Lösche einen Task – hier nutzen wir den dedizierten Endpunkt DELETE an /tasks/delete/<task_id>/
  deleteTask(taskId: number): Observable<any> {
    const url = `${this.tasksUrl}delete/${taskId}/`;
    return this.http.delete(url);
  }

  // Benutzerbezogene Endpunkte (sofern diese in Django vorhanden sind)
  getUsers(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.usersUrl);
  }

  getUserById(userId: number): Observable<Contact> {
    const url = `${this.usersUrl}${userId}/`;
    return this.http.get<Contact>(url);
  }
}
