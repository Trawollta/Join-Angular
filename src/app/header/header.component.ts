// header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User, GuestUser } from '../models/user';
import { GetUserService } from '../services/getuser.service';

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

  constructor(private getUserService: GetUserService, private router: Router) {}

  ngOnInit() {
    this.loadUserIcon();
  }

  loadUserIcon() {
    const token = localStorage.getItem('authToken');
    console.log('Gefundener Token:', token); // Debug-Ausgabe

    if (token) {
      this.getUserService.getCurrentUser() 
      
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.router.navigate(['/login']); // Angenommen, du hast eine Login-Seite
  }
}
