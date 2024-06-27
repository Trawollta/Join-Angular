import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../models/tasks';
import { AddTaskService } from '../services/add-tasks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contacts-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contacts-dialog.component.html',
  styleUrls: ['./edit-contacts-dialog.component.scss']
})
export class EditContactsDialogComponent {

  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Task>();

  isEditing: boolean = false;

  constructor(private addTaskService: AddTaskService) {}

  closeOverlay() {
    this.close.emit();
  }

  startEditing(): void {
    this.isEditing = true;
  }

  saveEdits(): void {
    if (!this.task.id) {
      console.error('Task ohne gültige ID kann nicht aktualisiert werden');
      return;
    }

    this.addTaskService.updateTask(this.task).subscribe({
      next: (updatedTask: Task) => {
        this.edit.emit(updatedTask);
        this.isEditing = false;
        console.log('Task erfolgreich aktualisiert');
        if (updatedTask && updatedTask.assigned_to) {
          console.log('Updated Assigned Users:', updatedTask.assigned_to);
        } else {
          console.error('Kein assigned_to-Array im aktualisierten Task-Objekt gefunden');
        }
      },
      error: (error) => {
        console.error('Fehler beim Aktualisieren des Tasks:', error);
      }
    });
  }

  deleteTask(taskId: number): void {
    this.addTaskService.deleteTask(taskId).subscribe({
      next: () => {
        console.log('Task erfolgreich gelöscht');
        this.close.emit(); // Overlay schließen
      },
      error: (error) => {
        console.error('Fehler beim Löschen des Tasks', error);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) {
      return '';  // Rückgabe eines leeren Strings, wenn einer der Namen nicht definiert ist
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
