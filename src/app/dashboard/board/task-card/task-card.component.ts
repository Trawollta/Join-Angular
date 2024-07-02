import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Task } from '../../../models/tasks';
import { AddTaskService } from '../../../services/add-tasks.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../models/contacts'; // Importieren des Contact-Interfaces

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
  assignedUsers: Contact[] = [];
  showOverlay = false;

  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();

  constructor(private addTaskService: AddTaskService) {}

  ngOnInit(): void {
    this.loadAssignedUsers();
  }

  async loadAssignedUsers() {
    if (this.task && this.task.assigned_to) {
      this.assignedUsers = [];
      for (const userId of this.task.assigned_to) {
        try {
          const userData = await this.addTaskService.getUserById(userId.id).toPromise();
          if (userData) {
            this.assignedUsers.push(userData);
          }
        } catch (error) {
          console.error('Fehler beim Abrufen der Benutzerdaten:', error);
        }
      }
      console.log('Assigned Users:', this.assignedUsers);
    } else {
      console.error('Kein assigned_to-Array im Task-Objekt gefunden');
      this.assignedUsers = [];
    }
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) {
      return '';
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  openOverlay() {
    this.showOverlay = true;
  }

  closeOverlay() {
    this.showOverlay = false;
  }
}
