import { Component } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';
import { ContentComponent } from './content/content.component';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { HeaderComponent } from '../header/header.component';
// import { AddContactsDialogComponent } from '../add-contacts-dialog/add-contacts-dialog.component';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ NavigationComponent,
    ContentComponent,
    SummaryComponent,
    AddTaskComponent,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


}
