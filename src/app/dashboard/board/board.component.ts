import { Component, OnInit } from '@angular/core';
import { AddTaskService } from '../../services/add-tasks.service';
import { Task } from '../../models/tasks';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CommonModule, FormsModule, TaskCardComponent, ButtonComponent, DragDropModule]
})
export class BoardComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchQuery: string = '';

  constructor(private addTaskService: AddTaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  getTasksByStatus(status: 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE'): Task[] {
    return this.filteredTasks.filter(task => task.status === status);
  }

  loadTasks(): void {
    this.addTaskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks; // Initialize filteredTasks
      },
      error: (error) => {
        console.error('Fehler beim Laden der Tasks', error);
      }
    });
  }

  filterTasks(): void {
    if (this.searchQuery.trim()) {
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  onDeleteTask(taskId: number): void {
    this.addTaskService.deleteTask(taskId).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Fehler beim Löschen der Task', error);
      }
    });
  }

  onEditTask(task: Task): void {
    this.loadTasks(); // Refresh the task list after editing
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.status = event.container.id as 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE';
      this.addTaskService.updateTask(task).subscribe({
        next: () => {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        },
        error: (error) => {
          console.error('Fehler beim Aktualisieren der Task', error);
        }
      });
    }
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  navigateToAddTask(): void {
    this.router.navigate(['dashboard/addtask']); // Korrigierter Pfad
  }
}
