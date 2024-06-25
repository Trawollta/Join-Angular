import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Task } from '../../../models/tasks';
import { AddTaskService } from '../../../services/add-tasks.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  tasks: Task[] = [];
  editingTask: Task | null = null;
  assignedUsers: { first_name: string, last_name: string }[] = [];

  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();

  constructor(private addTaskService: AddTaskService) {}

  ngOnInit(): void {
    // Debugging-Ausgabe, um die Task-Daten zu überprüfen
    console.log('Initiale Task-Daten:', this.task);
    
    // Überprüfen und zuweisen der zugewiesenen Benutzer
    if (this.task && this.task.assigned_to) {
      this.assignedUsers = this.task.assigned_to;
      console.log('Assigned Users:', this.assignedUsers); // Debugging-Ausgabe
    } else {
      console.error('Kein assigned_to-Array im Task-Objekt gefunden');
    }
  }

  getInitials(firstName: string, lastName: string): string {
    console.log('GetInitials aufgerufen mit:', firstName, lastName); // Debugging-Ausgabe
    if (!firstName || !lastName) {
      return '';  // Rückgabe eines leeren Strings, wenn einer der Namen nicht definiert ist
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  deleteTask(taskId: number): void {
    this.addTaskService.deleteTask(taskId).subscribe({
      next: () => {
        console.log('Task erfolgreich gelöscht');
        this.delete.emit(taskId);  // Event auslösen
      },
      error: (error) => {
        console.error('Fehler beim Löschen des Tasks', error);
      }
    });
  }

  startEditing(task: Task): void {
    this.editingTask = { ...task };
  }

  saveEdits(task: Task): void {
    if (!task.id) {
      console.error('Task ohne gültige ID kann nicht aktualisiert werden');
      return;
    }

    this.addTaskService.updateTask(task).subscribe({
      next: (updatedTask: Task) => {
        this.edit.emit(updatedTask); // Emit an edit event with the updated task
        this.editingTask = null; // Exit editing mode
        console.log('Task erfolgreich aktualisiert');
        
        // Aktualisiere die zugewiesenen Benutzer
        if (updatedTask && updatedTask.assigned_to) {
          this.assignedUsers = updatedTask.assigned_to;
          console.log('Updated Assigned Users:', this.assignedUsers); // Debugging-Ausgabe
        } else {
          console.error('Kein assigned_to-Array im aktualisierten Task-Objekt gefunden');
        }
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren des Tasks:', error);
      }
    });
  }
}
