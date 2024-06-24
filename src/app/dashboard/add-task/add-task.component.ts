import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddTaskService } from '../../services/add-tasks.service';
import { ContactsService } from '../../services/contacts.service';
import { Contact } from '../../models/contacts';
import { MatNativeDateModule } from '@angular/material/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    CommonModule,
    MatSelectModule,
    ContactsComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  currentPriority: 'Low' | 'Medium' | 'Urgent' = 'Low';
  activePriority: 'Low' | 'Medium' | 'Urgent' = 'Low';
  contacts$: Observable<Contact[]>; // Benutzerdaten als Observable
  selectedUsers: number[] = [];
  dropdownOpen = false;

  constructor(
    private taskService: AddTaskService,
    private contactsService: ContactsService,
    private fb: FormBuilder
  ) {
    this.contacts$ = this.contactsService.getContacts(); // Initialisiere das Observable
  }

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: [this.currentPriority, Validators.required], // Initialisiert mit aktuellem Wert
      status: ['', Validators.required],
      users: [[], Validators.required] // Hinzugefügt für die Benutzer
    });
  }

  isSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  setPriority(priority: 'Low' | 'Medium' | 'Urgent') {
    this.currentPriority = priority;
    this.activePriority = priority;
    this.taskForm.patchValue({ priority });
  }

  onCheckboxChange(event: Event, userId: number) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
    }
    this.taskForm.patchValue({ users: this.selectedUsers });
  }

  async addTask() {
    if (this.taskForm.valid) {
      try {
        console.log('Formulardaten:', this.taskForm.value);
        await this.taskService.newTask(this.taskForm.value);
        alert('Task erfolgreich hinzugefügt!');
      } catch (e) {
        if (e instanceof Error) {
          console.error('Es gab ein Problem', e);
          alert('Fehler beim Hinzufügen der Aufgabe: ' + e.message);
        } else {
          console.error('Unbekannter Fehler', e);
          alert('Ein unbekannter Fehler ist aufgetreten');
        }
      }
    } else {
      console.error('Formular ist nicht gültig');
    }
  }
}
