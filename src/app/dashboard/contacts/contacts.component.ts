import { Component, OnInit, HostListener } from '@angular/core';
import { Contact } from '../../models/contacts';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  templateUrl: './contacts.component.html',
  imports: [CommonModule, ButtonComponent],
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contactsList: Contact[] = [];
  sortedContacts: { [key: string]: Contact[] } = {};
  displayedAlphabet: string[] = [];  
  selectedContact: Contact | null = null; 
  screenWidth: number;

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
        this.contactsList.forEach(contact => {
          console.log(`Kontakt: ${contact.first_name}, Farbe: ${contact.color}`); // Debug-Ausgabe
        });
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
}
