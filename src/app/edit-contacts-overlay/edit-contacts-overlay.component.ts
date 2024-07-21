import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../services/contacts.service';
import { Contact } from '../models/contacts';

@Component({
  selector: 'app-edit-contacts-overlay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-contacts-overlay.component.html',
  styleUrls: ['./edit-contacts-overlay.component.scss']
})
export class EditContactsOverlayComponent implements OnInit, OnChanges {

  @Input() contact: Contact | null = null;
  @Input() showOverlay = false;
  @Output() close = new EventEmitter<void>();
  @Output() editContactEvent = new EventEmitter<Contact>();
  editContactForm: FormGroup;

  constructor(private fb: FormBuilder, private contactsService: ContactsService) {
    this.editContactForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      color: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.contact) {
      this.setFormValues(this.contact);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contact'] && this.contact) {
      this.setFormValues(this.contact);
    }
  }

  setFormValues(contact: Contact) {
    this.editContactForm.patchValue({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      color: contact.color || '#000000' // Standardfarbe auf Schwarz gesetzt, falls undefined
    });
  }

  closeOverlay() {
    this.close.emit();
  }

  editContact() {
    if (this.editContactForm.valid && this.contact) {
      this.contact= {
        id: this.contact.id,
        number: this.contact.number,
        username: this.contact.username,
        first_name: this.editContactForm.controls['first_name'].value,
        last_name: this.editContactForm.controls['last_name'].value,
        email: this.editContactForm.controls['email'].value,
        color: this.editContactForm.controls['color'].value
      }
      this.contactsService.updateContact(this.contact).subscribe({
        next: (contact: Contact) => {
          this.refreshContacts();
          this.closeOverlay();
          location.reload();
        },
        error: (err: any) => {
          console.error('Fehler beim Aktualisieren des Kontakts:', err);
        }
      });
    } else {
      console.warn('Formular ungültig:', this.editContactForm.errors);
      this.logFormErrors();
    }
  }

  refreshContacts() {
    this.contactsService.getContacts().subscribe({
      next: (contacts) => {
        console.log('Kontakte neu geladen:', contacts);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kontakte:', err);
      }
    });
  }

  logFormErrors() {
    Object.keys(this.editContactForm.controls).forEach(key => {
      const control = this.editContactForm.get(key);
      if (control && control.invalid) {
        console.log(`Ungültiges Feld: ${key}`, control.errors);
      }
    });
  }
}
