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
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
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
  newSubtask = '';
  subtasks: string[] = [];
  categories: { id: number, name: string, color: string }[] = [
    { id: 1, name: 'General', color: '#CCCCCC' },
    { id: 2, name: 'Work', color: '#FF5733' },
    { id: 3, name: 'Personal', color: '#2ECC71' }
  ];
  
  
  newCategory = '';
  showCategoryInput = false;

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
      subtasks: this.fb.array([]),
      category: [null, Validators.required],  // ✅ `null` statt `''`, damit wir ein Objekt speichern
      due_date: ['', Validators.required],
    });
  }
  

  ngOnInit(): void {}

  get assigned_to() {
    return this.taskForm.get('assigned_to') as FormArray;
  }

  get subtasksArray() {
    return this.taskForm.get('subtasks') as FormArray;
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

  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push(this.newSubtask);
      this.subtasksArray.push(new FormControl(this.newSubtask));
      this.newSubtask = '';
    }
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
    this.subtasksArray.removeAt(index);
  }

  toggleCategoryInput() {
    this.showCategoryInput = !this.showCategoryInput;
  }

  addCategory() {
    if (this.newCategory.trim()) {
      const newCategory = {
        id: this.categories.length + 1,
        name: this.newCategory,
        color: '#000000' // Default color, you can change it as needed
      };
      this.categories.push(newCategory);
      this.newCategory = '';
      this.showCategoryInput = false;
    }
  }

  async addTask() {
    if (this.taskForm.valid) {
      try {
        const taskData = { ...this.taskForm.value };
  
        // Stelle sicher, dass category als ID gesendet wird
        taskData.category_id = taskData.category?.id || null;
        delete taskData.category; // Entferne das Objekt
  
        console.log("📤 Gesendete Task-Daten:", JSON.stringify(taskData, null, 2));
  
        const response = await this.taskService.newTask(taskData).toPromise();
        this.taskCreated = true;
        setTimeout(() => {
          this.taskCreated = false;
          this.router.navigate(['/dashboard/board']);
        }, 4000);
      } catch (e) {
        console.error("❌ Fehler beim Erstellen der Aufgabe:", e);
      }
    }
  }
  
  
  
  selectedCategory: { id: number, name: string, color: string } | null = null;
showCategoryDropdown = false;

toggleCategoryDropdown() {
  this.showCategoryDropdown = !this.showCategoryDropdown;
}

selectCategory(category: { id: number, name: string, color: string }) {
  this.selectedCategory = category;
  this.taskForm.patchValue({ category }); // Kategorie in Form setzen
  this.showCategoryDropdown = false;
}

  
  
  

  onCategoryChange(event: any) {
    if (event.value === '+ Add Category') {
      this.showCategoryInput = true;
    } else {
      this.showCategoryInput = false;
    }
  }
}
