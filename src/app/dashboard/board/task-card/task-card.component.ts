import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Task, User } from '../../../models/tasks';
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
  assignedUsers: User[] = [];
  showOverlay = false;

  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();

  ngOnInit(): void {
    this.assignedUsers = this.task.assigned_to;
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
    console.log('close overlay');
    this.showOverlay = false;
  }
}
