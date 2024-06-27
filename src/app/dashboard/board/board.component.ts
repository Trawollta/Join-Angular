import { Component, OnInit } from '@angular/core';
import { AddTaskService } from '../../services/add-tasks.service';
import { Task } from '../../models/tasks';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [CommonModule, FormsModule, TaskCardComponent, ButtonComponent, DragDropModule]
})
export class BoardComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private addTaskService: AddTaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  getTasksByStatus(status: 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE'): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  loadTasks(): void {
    this.addTaskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Tasks', error);
      }
    });
  }

  onDeleteTask(taskId: number): void {
    this.loadTasks();
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id;
      task.status = newStatus as 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE';
      this.addTaskService.updateTask(task).subscribe(() => {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      });
    }
  }
}
