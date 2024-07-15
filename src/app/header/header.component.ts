import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetUserService } from '../services/getuser.service';
import { User } from '../models/user';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component'; // Importiere die Komponente

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, EditProfileDialogComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userInitials: string = '';
  isOverlayVisible: boolean = false;
  isEditProfileVisible: boolean = false;
  userColor: string = '';
  userId: number = 0;
  currentUser: User | null = null;

  constructor(private getUserService: GetUserService, private router: Router) {}

  ngOnInit() {
    this.getUserService.currentUserId.subscribe((userId) => {
      this.userId = userId;
      if (userId) {
        this.fetchCurrentUser();
      }
    });
  }

  fetchCurrentUser() {
    this.getUserService.fetchCurrentUser();
    this.getUserService.getCurrentUserObservable().subscribe(
      (user) => {
        if (user) {
          this.currentUser = user;
          this.userInitials = this.getInitials(user.first_name, user.last_name);
          this.userColor = user.color;
          this.isLoggedIn = true;
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

  openEditProfile() {
    this.isEditProfileVisible = true;
    this.toggleOverlay();
  }

  closeEditProfile() {
    this.isEditProfileVisible = false;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
