import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'] // Korrektur von 'styleUrl' zu 'styleUrls'
})
export class ButtonComponent {
  @Input() caption: string = "";
  @Input() imgPath: string = "";
  @Input() type: string = "button"; // Sie können hier einen Standardwert setzen, wenn gewünscht
  @Input() isDisabled: boolean = false;
  @Input() classes?: string | string[] = [];
  @Input() isActive: boolean = false; 
  @Input() priority: 'Low' | 'Medium' | 'Urgent' = 'Low'; 
  @Output() clicked = new EventEmitter<'Low' | 'Medium' | 'Urgent'>(); 
  



  onClick() {
    this.clicked.emit(this.priority); // Sendet die Priorität beim Klicken
  }
}
