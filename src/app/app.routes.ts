import { Routes } from '@angular/router';
import { ContactsComponent } from './dashboard/contacts/contacts.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { AddTaskComponent } from './dashboard/add-task/add-task.component';
import { BoardComponent } from './dashboard/board/board.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';

export const routes: Routes = [
    { path: 'contacts', component: ContactsComponent, pathMatch: 'full' },
    { path: 'summary', component: SummaryComponent, pathMatch: 'full' },
    { path: 'addtask', component: AddTaskComponent, pathMatch: 'full' },
    { path: 'board', component: BoardComponent, pathMatch: 'full' },
    { path: 'login', component: SignInComponent, pathMatch: 'full' },
    { path: 'signup', component: SignUpComponent, pathMatch: 'full' },
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
    { path: '**', redirectTo: '/login' }  // Fallback route
];
