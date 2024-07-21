import { Component, OnInit, HostListener } from '@angular/core';
import { Contact } from '../../models/contacts';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../services/contacts.service';
import { AddContactsComponent } from '../../add-contacts/add-contacts.component';
import { EditContactsOverlayComponent } from '../../edit-contacts-overlay/edit-contacts-overlay.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  templateUrl: './contacts.component.html',
  imports: [CommonModule, AddContactsComponent, EditContactsOverlayComponent],
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contactsList: Contact[] = [];
  sortedContacts: { [key: string]: Contact[] } = {};
  displayedAlphabet: string[] = [];  
  selectedContact: Contact | null = null; 
  screenWidth: number;
  showOverlay = false;
  showEditOverlay = false;

  constructor(private contactsService: ContactsService) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.loadContacts();
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.screenWidth = window.innerWidth;
  }
  loadContacts() {
    this.contactsService.getContacts().subscribe({
      next: (contacts) => {
        if (!contacts.every(contact => contact.first_name)) {
          console.error('Alle Kontakte müssen einen Vornamen haben.');
        }
        this.contactsList = contacts;
        this.sortedContacts = this.getSortedContactsFromList(contacts);
        this.generateAlphabet();
      },
      error: (err) => console.error('Fehler beim Laden der Kontakte', err)
    });
  }

  getSortedContactsFromList(contacts: Contact[]): { [key: string]: Contact[] } {
    const sortedContacts: { [key: string]: Contact[] } = {};

    contacts.sort((a, b) => {
      const nameA = a.first_name || '';
      const nameB = b.first_name || '';

      return nameA.localeCompare(nameB);
    });

    contacts.forEach(contact => {
      const firstLetter = contact.first_name ? contact.first_name.charAt(0).toUpperCase() : '?';
      if (!sortedContacts[firstLetter]) {
        sortedContacts[firstLetter] = [];
      }
      sortedContacts[firstLetter].push(contact);
    });
    return sortedContacts;
  }


  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  generateAlphabet() {
    this.displayedAlphabet = Object.keys(this.sortedContacts).sort();
  }

  

  selectContact(contact: Contact) {
    this.selectedContact = contact; 
  }

  deselectContact() {
    this.selectedContact = null;
  }

  openOverlay() {
    this.showOverlay = true;
  }

  closeOverlay() {
    this.showOverlay = false;
  }

  openEditOverlay() {
    this.showEditOverlay = true;
  }

  closeEditOverlay() {
    this.showEditOverlay = false;
  }

  addContact(contact: Contact) {
    this.contactsList.push(contact);
    this.sortedContacts = this.getSortedContactsFromList(this.contactsList);
    this.generateAlphabet();
  }

  updateContact(updatedContact: Contact) {
    const index = this.contactsList.findIndex(contact => contact.id === updatedContact.id);
    if (index !== -1) {
      this.contactsList[index] = updatedContact;
      this.sortedContacts = this.getSortedContactsFromList(this.contactsList);
      this.generateAlphabet();
      if (this.selectedContact?.id === updatedContact.id) {
        this.selectedContact = updatedContact;
      }
    }
  }

  deleteContact(contact: Contact) {
    if (confirm(`Möchten Sie den Kontakt ${contact.first_name} ${contact.last_name} wirklich löschen?`)) {
      this.contactsService.deleteContact(contact.id).subscribe({
        next: () => {
          this.contactsList = this.contactsList.filter(c => c.id !== contact.id);
          this.sortedContacts = this.getSortedContactsFromList(this.contactsList);
          this.generateAlphabet();
          this.deselectContact();
          alert('Kontakt erfolgreich gelöscht');
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Kontakts:', err);
        }
      });
    }
  }
}
