import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../models/user';
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.firstname = user.first_name;
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
