import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../services/contacts.service';
import { Contact } from '../models/contacts';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss']
})
export class AddContactsComponent {

  @Input() showOverlay = false;
  @Output() close = new EventEmitter<void>();
  @Output() addContactEvent = new EventEmitter<Contact>();
  addContactForm: FormGroup;

  constructor(private fb: FormBuilder, private contactsService: ContactsService, private auth: AuthService) {
    this.addContactForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      color: ['#000000', Validators.required]
       // Standardfarbe auf Schwarz gesetzt
    });
  }

  closeOverlay() {
    this.close.emit();
  }

  addContact() {
    if (this.addContactForm.valid) {
      const newContact: Contact = this.addContactForm.value;
      this.contactsService.addContact(newContact).subscribe({
        next: (contact: Contact) => {
          this.addContactEvent.emit(contact);
          this.closeOverlay();
          location.reload();
        },
        error: (err) => {
          console.error('Fehler beim Hinzufügen des Kontakts:', err);
        }
      });
    } else {
      console.warn('Formular ungültig:', this.addContactForm.errors);
    }
  }
}
