import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetUserService } from '../services/getuser.service';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userInitials: string = '';
  isOverlayVisible: boolean = false;
  userId: number = 0;

  constructor(private getUserService: GetUserService, private router: Router) {}

  ngOnInit() {
    this.getUserService.currentUserId.subscribe((userId) => {
      this.userId = userId;
    });
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    this.getUserService.fetchCurrentUser();
    this.getUserService.getCurrentUserObservable().subscribe(
      (user) => {
        if (user) {
          this.userInitials = this.getInitials(user.first_name, user.last_name);
          this.isLoggedIn = true; // Hier setzen wir isLoggedIn auf true
        } else {
          this.isLoggedIn = false;
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen des Benutzers:', error);
        this.isLoggedIn = false;
      }
    );
  }

  private getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) {
      return '';
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  toggleOverlay() {
    this.isOverlayVisible = !this.isOverlayVisible;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
