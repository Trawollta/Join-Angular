import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GuestUser, User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { AddTaskService } from '../../services/add-tasks.service';
import { Task } from '../../models/tasks';
import { GetUserService } from '../../services/getuser.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  username: string | null = null;
  firstname: string | null = null;
  greeting: string = '';
  toDoCount: number = 0;
  inProgressCount: number = 0;
  awaitFeedbackCount: number = 0;
  doneCount: number = 0;
  urgentCount: number = 0;
  tasksCount: number = 0;

  constructor(private authService: AuthService, private taskService: AddTaskService, private getUserService: GetUserService) {}

  ngOnInit() {
    
    this.getUserService.getCurrentUser()
  }

  greetTime(): string {
    let date = new Date();
    let hour = date.getHours();
    let greeting = '';

    if (hour >= 17) {
      greeting = 'Guten Abend';
    } else if (hour >= 12) {
      greeting = 'Guten Nachmittag';
    } else if (hour >= 6) {
      greeting = 'Guten Morgen';
    } else {
      greeting = 'Zeit, ins Bett zu gehen';
    }

    return greeting + (this.firstname ? ' ' + this.firstname : '!');
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasksCount = tasks.length;
      this.toDoCount = tasks.filter(task => task.status === 'TO_DO').length;
      this.inProgressCount = tasks.filter(task => task.status === 'IN_PROGRESS').length;
      this.awaitFeedbackCount = tasks.filter(task => task.status === 'AWAIT_FEEDBACK').length;
      this.doneCount = tasks.filter(task => task.status === 'DONE').length;
      this.urgentCount = tasks.filter(task => task.priority === 'Urgent').length; // Typ sollte mit dem tatsächlichen Wert übereinstimmen
    }, (error: any) => {
      console.error('Fehler beim Laden der Tasks', error);
    });
  }
}
