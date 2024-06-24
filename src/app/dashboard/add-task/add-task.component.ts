import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule,} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AddTaskService } from '../../services/add-tasks.service';
import { ContactsService } from '../../services/contacts.service';
import { Contact } from '../../models/contacts';
import { MatNativeDateModule } from '@angular/material/core';
import { Task } from '../../models/tasks';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ButtonComponent,
    InputComponent, 
    CommonModule, 
    MatSelectModule,
    ContactsComponent, 
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ButtonComponent],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']

})


export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  currentPriority: 'Low' | 'Medium' | 'Urgent' = 'Low';
  activePriority: 'Low' | 'Medium' | 'Urgent' = 'Low';  // Hinzugefügt

  constructor(
    private taskService: AddTaskService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  setPriority(priority: 'Low' | 'Medium' | 'Urgent') {
    this.currentPriority = priority;
    this.activePriority = priority;  // Hinzugefügt
    this.taskForm.patchValue({ priority });
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


