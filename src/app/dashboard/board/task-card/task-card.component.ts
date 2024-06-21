import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../models/tasks';
import { AddTaskService } from '../../../services/add-tasks.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  tasks: Task[] = [];
  editingTask: Task | null = null;
  statuses: any[] = [];



  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();

  constructor(private addTaskService: AddTaskService) {}

  deleteTask(taskId: number | undefined): void {
      if (taskId === undefined) {
        console.error('Versuch, eine Aufgabe ohne gültige ID zu löschen');
        return; // Beenden der Funktion, wenn keine gültige ID vorhanden ist
      } 
        this.addTaskService.deleteTask(taskId).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
          },
          error: (error) => console.error('Fehler beim Löschen der Aufgabe:', error)
        });
    }
  

  startEditing(task: Task): void {
    this.editingTask = task;
  }

  saveEdits(task: Task): void {
    if (!task.id) {
      console.error('Task ohne gültige ID kann nicht aktualisiert werden');
      return;
    }
  
    this.addTaskService.updateTask(task).subscribe({
      next: () => {
        this.edit.emit(task); // Emit an edit event with the updated task
        this.editingTask = null; // Exit editing mode
        console.log('Task erfolgreich aktualisiert');
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren des Tasks:', error);
      }
    });
  }
}
