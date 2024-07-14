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
    debugger;
    console.log('Opening overlay');
    event.stopPropagation(); 
    this.showOverlay = true;
  }

  closeOverlay(event?: Event) {
    console.log('Closing overlay');
    if (event) {
      event.stopPropagation();
    }
    this.showOverlay = false;
    this.close.emit();
  }

  handleClose(event?: Event) {
    console.log('Handling close event');
    this.closeOverlay(event);
  }

  handleDelete(event?: Event) {
    console.log('Handling delete event');
    if (event) {
      event.stopPropagation();
    }
    this.delete.emit(this.task.id);
    this.closeOverlay(event);
  }
}
