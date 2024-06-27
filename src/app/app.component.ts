import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTaskComponent } from './dashboard/add-task/add-task.component';
import { NavigationComponent } from './dashboard/navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
// import { AddContactsDialogComponent } from './add-contacts-dialog/add-contacts-dialog.component';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './dashboard/board/sidenav/sidenav.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    DashboardComponent, 
    AddTaskComponent,
    NavigationComponent,
    HeaderComponent,
    CommonModule,
  SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent {
  title = 'join';

  constructor() {
  
  }
}
