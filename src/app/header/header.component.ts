import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User, GuestUser } from '../models/user';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.loggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loadUserIcon();
      }
    });
    this.loadUserIcon();
  }

  loadUserIcon() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          if (user) {
            this.isLoggedIn = true;
            this.userInitials = this.getInitials(user);
          }
        },
        error: (error) => {
          console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
          this.isLoggedIn = false;
        }
      });
    } else {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser) as User | GuestUser;
        this.userInitials = this.getInitials(user);
      } else {
        console.log('Kein Token gefunden, Benutzer ist nicht eingeloggt');
      }
    }
  }

  private getInitials(user: User | GuestUser): string {
    if ('first_name' in user && 'last_name' in user) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    } else if ('username' in user && user.username === 'Gast') {
      return 'G';
    } else {
      return '';
    }
  }

  toggleOverlay() {
    this.isOverlayVisible = !this.isOverlayVisible;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']); // Angenommen, du hast eine Login-Seite
  }
}
