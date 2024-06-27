import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Task } from '../../../models/tasks';
import { AddTaskService } from '../../../services/add-tasks.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditContactsDialogComponent } from '../../../edit-contacts-dialog/edit-contacts-dialog.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [FormsModule, CommonModule, EditContactsDialogComponent],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  tasks: Task[] = [];
  editingTask: Task | null = null;
  assignedUsers: { first_name: string, last_name: string }[] = [];
  showOverlay = false;

  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();

  constructor(private addTaskService: AddTaskService) {}

  ngOnInit(): void {
    console.log('Initiale Task-Daten:', this.task);
    if (this.task && this.task.assigned_to) {
      this.assignedUsers = this.task.assigned_to;
      console.log('Assigned Users:', this.assignedUsers);
    } else {
      console.error('Kein assigned_to-Array im Task-Objekt gefunden');
    }
  }

  getInitials(firstName: string, lastName: string): string {
    console.log('GetInitials aufgerufen mit:', firstName, lastName);
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
