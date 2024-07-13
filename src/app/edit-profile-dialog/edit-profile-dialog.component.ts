import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetUserService } from '../services/getuser.service';
import { User } from '../models/user';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  @Input() userId: number | null = null;
  @Output() close = new EventEmitter<void>();
  selectedContact: User | null = null;

  constructor(private getUserService: GetUserService) {}

  ngOnInit() {
    if (this.userId !== null) {
      this.getUserService.fetchCurrentUser();
      this.getUserService.getCurrentUserObservable().subscribe(
        user => {
          if (user) {
            this.selectedContact = user;
          }
        },
        error => console.error('Fehler beim Laden der Benutzerdaten:', error)
      );
    }
  }

  async saveChanges() {
    if (this.selectedContact && this.selectedContact.id) {
      try {
        await this.getUserService.updateUser(this.selectedContact);
        this.close.emit();
      } catch (error) {
        console.error('Fehler beim Speichern der Änderungen:', error);
      }
    } else {
      console.error('Benutzer-ID fehlt');
    }
  }

  async deleteUser() {
    if (this.selectedContact && this.selectedContact.id) {
      try {
        await this.getUserService.deleteUser(this.selectedContact.id);
        this.close.emit();
      } catch (error) {
        console.error('Fehler beim Löschen des Benutzers:', error);
      }
    } else {
      console.error('Benutzer-ID fehlt');
    }
  }

  closeDialog() {
    this.close.emit();
  }
}
