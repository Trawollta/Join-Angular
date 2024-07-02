import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetUserService } from '../services/getuser.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

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
  currentUser$: Observable<User | null>;

  constructor(private getUserService: GetUserService, private router: Router) {
    this.currentUser$ = this.getUserService.getCurrentUserObservable();
  }

  ngOnInit() {
    this.getUserService.fetchCurrentUser();
    this.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userInitials = this.getInitials(user);
      }
    });
  }

  private getInitials(user: User): string {
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    } else if (user.username === 'Gast') {
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
