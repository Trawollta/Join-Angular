import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GuestUser, User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: User | GuestUser | null) => {
      if (user) {
        this.username = user.username;
        this.firstname = 'first_name' in user ? user.first_name : 'Gast'; // Setzen Sie den Vornamen für Gastbenutzer
        this.greeting = this.greetTime(); // Grußtext speichern
      } else {
        this.username = null;
        this.firstname = null;
        this.greeting = this.greetTime(); // Grußtext speichern
      }
    });
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
}
