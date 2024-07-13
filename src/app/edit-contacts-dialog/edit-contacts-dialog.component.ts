import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Contact } from '../models/contacts';
import { Task } from '../models/tasks';
import { AddTaskService } from '../services/add-tasks.service';
import { ContactsService } from '../services/contacts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contacts-dialog',
  templateUrl: './edit-contacts-dialog.component.html',
  styleUrls: ['./edit-contacts-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditContactsDialogComponent implements OnInit {

  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  availableUsers: Contact[] = [];
  selectedUser: Contact | null = null;
  isEditDialogOpen = true;
  dropdownOpen = false;
  isEditMode = false;

  constructor(private addTaskService: AddTaskService, private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.loadAvailableUsers();
  }

  loadAvailableUsers(): void {
    this.contactsService.getContacts().subscribe(
      users => {
        this.availableUsers = users;
      }
    );
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) {
      return '';
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  closeOverlay(event: Event) {
    // Verhindert das Schließen, wenn innerhalb des Dialogs geklickt wird
    if ((event.target as HTMLElement).closest('.overlay-content')) {
      return;
    }
    this.isEditDialogOpen = false;
    this.isEditMode = false;
    this.close.emit(); // Emit the close event to notify parent component
  }

  saveTask() {
    const updatedTask = {
      ...this.task,
      assigned_to: this.task.assigned_to.map(user => user.id)
    };

    this.addTaskService.updateTask(updatedTask as any).subscribe(
      updatedTask => {
        this.task = { 
          ...this.task, 
          assigned_to: updatedTask.assigned_to.map((id: number) => this.availableUsers.find(user => user.id === id)!)
        };
        this.isEditMode = false;
        this.closeOverlay(new Event(''));
      }
    );
  }

  deleteTask() {
    if (confirm('Möchten Sie diese Aufgabe wirklich löschen?')) {
      this.addTaskService.deleteTask(this.task.id).subscribe(
        () => {
          this.closeOverlay(new Event(''));
        }
      );
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(user: Contact): boolean {
    return this.task.assigned_to.some(u => u.id === user.id);
  }

  onCheckboxChange(event: Event, user: Contact) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.task.assigned_to.some(u => u.id === user.id)) {
        this.task.assigned_to.push(user);
      }
    } else {
      this.task.assigned_to = this.task.assigned_to.filter(u => u.id !== user.id);
    }
  }

  addAssignedUser() {
    if (this.selectedUser && this.task) {
      this.task.assigned_to.push(this.selectedUser);
      this.selectedUser = null;
    }
  }

  removeAssignedUser(index: number) {
    if (this.task) {
      this.task.assigned_to.splice(index, 1);
    }
  }
}
