import { Component, OnInit } from '@angular/core';
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
  contactColors: { [key: string]: string } = {};
  displayedAlphabet: string[] = [];  

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.contactsService.getContacts().subscribe({
      next: (contacts) => {
        if (!contacts.every(contact => contact.first_name)) {
          console.error('Alle Kontakte müssen einen Vornamen haben.');
        }
        this.contactsList = contacts;
        this.sortedContacts = this.getSortedContactsFromList(contacts);
        this.generateContactColors(contacts);
        this.generateAlphabet(); 
      },
      error: (err) => console.error('Fehler beim Laden der Kontakte', err)
    });
  }

  generateContactColors(contacts: Contact[]) {
    contacts.forEach(contact => {
      this.contactColors[contact.first_name] = '#' + Math.floor(Math.random() * 16777215).toString(16);
    });
  }

  getSortedContactsFromList(contacts: Contact[]): { [key: string]: Contact[] } {
    console.log('Kontakte vor dem Sortieren:', contacts);
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
}
