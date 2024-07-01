import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../models/contacts';
import { Task } from '../models/tasks';

@Component({
  selector: 'app-edit-contacts-dialog',
  templateUrl: './edit-contacts-dialog.component.html',
  styleUrls: ['./edit-contacts-dialog.component.scss']
})
export class EditContactsDialogComponent {
  // @Input() task!: Task;
  // @Output() close = new EventEmitter<void>();
  // assignedUsers: Contact[] = [];

  // ngOnInit(): void {
  //   this.loadAssignedUsers();
  // }

  // loadAssignedUsers(): void {
  //   if (this.task && this.task.assigned_to) {
  //     this.assignedUsers = this.task.assigned_to.map(user => new Contact(user));
  //   } else {
  //     console.error('Kein assigned_to-Array im Task-Objekt gefunden');
  //     this.assignedUsers = [];
  //   }
  // }

  // getInitials(firstName: string, lastName: string): string {
  //   if (!firstName || !lastName) {
  //     return '';
  //   }
  //   return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  // }

  // closeOverlay(): void {
  //   this.close.emit();
  // }
}
