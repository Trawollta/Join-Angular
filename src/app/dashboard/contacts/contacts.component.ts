import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contacts';
import { CommonModule } from '@angular/common';
// import { AddContactsDialogComponent } from '../../add-contacts-dialog/add-contacts-dialog.component';
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

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.contactsService.getContacts().subscribe({
      next: (contacts) => {
        if (!contacts.every(contact => contact.first_name)) {
          console.error('Alle Kontakte müssen einen Vornamen haben.');
          // Behandle den Fall, dass einige Kontakte keinen Vornamen haben
        }
        this.contactsList = contacts;
        this.sortedContacts = this.getSortedContactsFromList(contacts);
        this.generateContactColors(contacts);
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
  
    // Sortiere die Kontakte mit einer sicheren Vergleichsfunktion
    contacts.sort((a, b) => {
      // Sicherstellen, dass first_name existiert, sonst leere Strings verwenden
      const nameA = a.first_name || '';
      const nameB = b.first_name || '';
  
      // Vergleiche die Namen mit einem Basis-String-Vergleich
      return nameA.localeCompare(nameB);
    });
  
    // Gruppiere die sortierten Kontakte nach dem ersten Buchstaben des Vornamens
    contacts.forEach(contact => {
      // Sicherstellen, dass first_name existiert, sonst '?' verwenden
      const firstLetter = contact.first_name ? contact.first_name.charAt(0).toUpperCase() : '?';
      if (!sortedContacts[firstLetter]) {
        sortedContacts[firstLetter] = [];
      }
      sortedContacts[firstLetter].push(contact);
    });
  
    console.log('Sortierte Kontakte:', sortedContacts);
    return sortedContacts;
  }
  

}