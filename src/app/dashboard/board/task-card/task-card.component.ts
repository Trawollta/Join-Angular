import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Task, User, Subtask } from '../../../models/tasks';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { EditTaskOverlayComponent } from '../../../edit-task-overlay/edit-task-overlay.component';


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [FormsModule, CommonModule,EditTaskOverlayComponent],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit, OnChanges {
  assignedUsers: User[] = [];
  showOverlay = false;

  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.loadAssignedUsers();
    if (this.task.subtasks && this.task.subtasks.length > 0 && typeof this.task.subtasks[0] === 'string') {
      this.task.subtasks = (this.task.subtasks as unknown as string[]).map((subtask: string) => ({
        title: subtask,
        completed: false
      }));
    }
  }

  openOverlay(event: Event): void {
    if (!this.showOverlay) {
      event.stopPropagation();
      this.showOverlay = true;
    }
  }

  closeOverlay(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    setTimeout(() => {
      this.showOverlay = false;
      this.close.emit();
    }, 0);
  }

  handleClose(): void {
    this.closeOverlay();
  }

  handleDelete(taskId: number): void {
    this.delete.emit(taskId);
    this.closeOverlay();
  }

  loadAssignedUsers(): void {
    this.assignedUsers = [];
    
    if (this.task && this.task.assigned_to?.length) {
      console.log("📡 Task-Daten:", this.task); // Debugging ✅
      
      if (typeof this.task.assigned_to[0] === 'object' && 'id' in this.task.assigned_to[0]) {
        console.log("✔ Benutzer-Objekte bereits vorhanden:", this.task.assigned_to);
        this.assignedUsers = this.task.assigned_to.map(user => ({
          ...user,
          color: user.color || this.generateRandomColor() // Falls Farbe fehlt
        }));
      } else {
        console.log("📡 Lade Benutzer über API...");
        (this.task.assigned_to as unknown as number[]).forEach((userId: number) => {
          console.log("🔍 Lade Benutzer-ID:", userId); // Debugging ✅
          this.contactsService.getUserById(userId).subscribe({
            next: (user: User) => {
              console.log("✅ Benutzer geladen:", user);
              user.color = user.color || this.generateRandomColor();
              this.assignedUsers.push(user);
              console.log("🎨 `assignedUsers` nach Push:", this.assignedUsers);
            },
            error: (error) => console.error('❌ Fehler beim Laden des Benutzers', userId, error)
          });
        });
      }
    } else {
      console.warn("⚠ Keine zugewiesenen Benutzer gefunden!", this.task);
    }
  }

  // 🚀 Funktion, um eine zufällige Farbe zu generieren (falls Farbe fehlt)
  generateRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFB533'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getInitials(firstName: string | null, lastName: string | null): string {
    if (!firstName && !lastName) return '?';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      console.log("📌 Task aktualisiert:", this.task);
      
      if (!this.task || !this.task.category) {
        console.warn("⚠ Keine Kategorie gefunden!", this.task);
        return;
      }
  
      console.log("🎨 Task-Kategorie:", this.task.category);
    }
  }

  // ✅ Fortschrittsanzeige für Subtasks
  getSubtaskCompletion(): string {
    if (!this.task.subtasks || this.task.subtasks.length === 0) return '0/0';
    const completed = this.task.subtasks.filter((subtask: Subtask) => subtask.completed).length;
    return `${completed}/${this.task.subtasks.length}`;
  }

  getSubtaskCompletionPercentage(): number {
    if (!this.task.subtasks || this.task.subtasks.length === 0) return 0;
    const completed = this.task.subtasks.filter((subtask: Subtask) => subtask.completed).length;
    return (completed / this.task.subtasks.length) * 100;
  }

  getCategoryClass(): string {
    if (!this.task || !this.task.category || !this.task.category.name) {
      return 'category-default';
    }
    return 'category-' + this.task.category.name.toLowerCase().replace(/\s+/g, '-');
  }

  
}
