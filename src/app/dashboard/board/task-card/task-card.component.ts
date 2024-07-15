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
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.assignedUsers = this.task.assigned_to;
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) {
      return '';
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  openOverlay(event: Event) {
    if (!this.showOverlay) {
      event.stopPropagation();
      this.showOverlay = true;
    }
  }

  closeOverlay(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    setTimeout(() => {
      this.showOverlay = false;
      this.close.emit();
    }, 0);
  }

  handleClose() {
    this.closeOverlay();
  }

  handleDelete(taskId: number) {
    this.delete.emit(taskId);
    this.closeOverlay();
  }
}
