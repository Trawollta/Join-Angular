import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userInitials: string | null = null;
  isOverlayVisible: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.isLoggedIn = true;
          this.userInitials = this.getInitials(user.first_name, user.last_name);
        },
        error: (error) => {
          console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
          this.isLoggedIn = false;
        }
      });
    } else {
      console.log('Kein Token gefunden, Benutzer ist nicht eingeloggt.');
      this.isLoggedIn = false;
    }
  }

  toggleOverlay() {
    this.isOverlayVisible = !this.isOverlayVisible;
  }

  logout() {
    this.authService.logout();
    this.userInitials = null;
    this.isOverlayVisible = false;
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  private getInitials(firstName: string | undefined, lastName: string | undefined): string {
    if (!firstName || !lastName) {
      return '';
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
