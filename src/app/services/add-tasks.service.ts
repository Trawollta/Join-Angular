import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Task } from '../../app/models/tasks';

@Injectable({
  providedIn: 'root'
})
export class AddTaskService {
  taskId!: number;

  private apiUrl = 'http://localhost:8000/tasks/';

  constructor(public http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
  }

  newTask(taskData: any): Promise<any> {
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
}
