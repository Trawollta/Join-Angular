// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { contacts } from '../models/contacts';
// import { addDoc, Firestore } from '@angular/fire/firestore';
// import { FormsModule } from '@angular/forms';
// import { ContactsService } from '../services/contacts.service';



// @Component({
//   selector: 'app-add-contacts-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule
//   ],
//   templateUrl: './add-contacts-dialog.component.html',
//   styleUrl: './add-contacts-dialog.component.scss'
// })
// export class AddContactsDialogComponent {

//   showOverlay: boolean = false;
//   contact: contacts = {
//     name: '',
//     email: '',
//     number: '',
//     id: 0
//   };


//   constructor(private contactsService: ContactsService) {}


//   async addContact() {
//     console.log(this.contact);
//     await this.contactsService.AddnewContact(this.contact);
//   }

//   generateRandomColor(): string {
//     // Generiere eine zufällige Farbe im Hexadezimalformat
//     return '#' + Math.floor(Math.random() * 16777215).toString(16);
// }


//   closeContactOverlay() {
//     this.showOverlay = false;
//   }


// }
