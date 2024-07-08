import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Task } from '../../models/tasks';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  styleUrls: ['./add-task.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('void', style({ right: '-100%' })),
      state('*', style({ right: '0' })),
      transition(':enter', [
        animate('0.5s ease')
      ]),
      transition(':leave', [
        animate('0.5s ease')
      ])
    ])
  ]
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  currentPriority: 'Low' | 'Medium' | 'Urgent' = 'Low';
  activePriority: 'Low' | 'Medium' | 'Urgent' = 'Low';
  contacts$: Observable<Contact[]>;
  selectedUsers: number[] = [];
  dropdownOpen = false;
  taskCreated = false;

  constructor(
    private taskService: AddTaskService,
    private contactsService: ContactsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.contacts$ = this.contactsService.getContacts();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      priority: [this.currentPriority, Validators.required],
      assigned_to: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  get assigned_to() {
    return this.taskForm.get('assigned_to') as FormArray;
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

  onCheckboxChange(event: Event, user: Contact) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.selectedUsers.includes(user.id)) {
        this.selectedUsers.push(user.id);
        this.assigned_to.push(new FormControl(user));
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== user.id);
      const index = this.assigned_to.controls.findIndex(control => control.value.id === user.id);
      this.assigned_to.removeAt(index);
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  async addTask() {
    if (this.taskForm.valid) {
      try {
        const taskData = this.taskForm.value;
        taskData.assigned_to = this.selectedUsers;
  
        const response = await this.taskService.newTask(taskData).toPromise();
        this.taskCreated = true;
        setTimeout(() => {
          this.taskCreated = false;
          this.router.navigate(['/dashboard/board']);
        }, 4000);
      } catch (e) {
        if (e instanceof Error) {
          alert('Fehler beim Hinzufügen der Aufgabe: ' + e.message);
        } else {
          alert('Ein unbekannter Fehler ist aufgetreten');
        }
      }
    }
  }
}
