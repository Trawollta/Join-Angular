// import { Routes } from '@angular/router';
// import { ContactsComponent } from './dashboard/contacts/contacts.component';
// import { SummaryComponent } from './dashboard/summary/summary.component';
// import { AddTaskComponent } from './dashboard/add-task/add-task.component';
// import { BoardComponent } from './dashboard/board/board.component';
// import { SignInComponent } from './authentication/sign-in/sign-in.component';
// import { SignUpComponent } from './authentication/sign-up/sign-up.component';

// export const routes: Routes = [
//     { path: 'contacts', component: ContactsComponent, pathMatch: 'full' },
//     { path: 'summary', component: SummaryComponent, pathMatch: 'full' },
//     { path: 'addtask', component: AddTaskComponent, pathMatch: 'full' },
//     { path: 'board', component: BoardComponent, pathMatch: 'full' },
//     { path: 'login', component: SignInComponent, pathMatch: 'full' },
//     { path: 'signup', component: SignUpComponent, pathMatch: 'full' },
//     { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
//     { path: '**', redirectTo: '/login' }  // Fallback route
// ];
import { Routes } from '@angular/router';
import { ContactsComponent } from './dashboard/contacts/contacts.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { AddTaskComponent } from './dashboard/add-task/add-task.component';
import { BoardComponent } from './dashboard/board/board.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      { path: 'login', component: SignInComponent },
      { path: 'signup', component: SignUpComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'contacts', component: ContactsComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'addtask', component: AddTaskComponent },
      { path: 'board', component: BoardComponent },
      { path: '**', redirectTo: 'login' }  // Fallback route
    ]
  }
];

