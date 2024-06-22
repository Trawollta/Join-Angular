import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    // Überprüfe, ob ein Token vorhanden ist, bevor die Anfrage gesendet wird
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
      console.log('Kein Token gefunden, Benutzer ist nicht eingeloggt');
    }
  }

  private getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
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
