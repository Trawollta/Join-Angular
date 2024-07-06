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

  constructor(private addTaskService: AddTaskService, private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.loadAvailableUsers();
  }

  loadAvailableUsers(): void {
    this.contactsService.getContacts().subscribe(
      users => {
        this.availableUsers = users;
      },
      error => {
        console.error('Fehler beim Laden der Benutzer:', error);
      }
    );
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) {
      return '';
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  closeOverlay() {
    console.log('Overlay wird geschlossen');
    this.isEditDialogOpen = false;
    // this.close.emit();
  }

  saveTask() {
    const updatedTask = {
      ...this.task,
      assigned_to: this.task.assigned_to.map(user => user.id) // Nur die IDs der Benutzer senden
    };

    this.addTaskService.updateTask(updatedTask as any).subscribe(
      updatedTask => {
        this.task = { 
          ...this.task, 
          assigned_to: updatedTask.assigned_to.map((id: number) => this.availableUsers.find(user => user.id === id)!)
        };
        this.closeOverlay();
      },
      error => {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
      }
    );
  }

  deleteTask() {
    if (confirm('Möchten Sie diese Aufgabe wirklich löschen?')) {
      this.addTaskService.deleteTask(this.task.id).subscribe(
        response => {
          this.closeOverlay();
        },
        error => {
          console.error('Fehler beim Löschen der Aufgabe:', error);
        }
      );
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
