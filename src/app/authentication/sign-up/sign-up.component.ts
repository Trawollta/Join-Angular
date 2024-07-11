import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonComponent } from '../../shared/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements AfterViewInit {
  username = '';
  password = '';
  confirmPassword = '';
  firstname = '';
  lastname = '';
  color = '';
  email = '';
  registrationSuccess = false;

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    this.drawInitials();
  }

  updateColor(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.color = inputElement.value;
    this.drawInitials();
  }

  selectBackgroundColor(): void {
    document.body.style.backgroundColor = this.color;
  }

  drawInitials(): void {
    if (this.canvas) {
      const context = this.canvas.nativeElement.getContext('2d');
      if (context) {
        context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        context.fillStyle = '#ffffff';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const initials = `${this.firstname.charAt(0).toUpperCase()}${this.lastname.charAt(0).toUpperCase()}`;
        context.fillText(initials, this.canvas.nativeElement.width / 2, this.canvas.nativeElement.height / 2);
      }
    }
  }

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.error('Die Passwörter stimmen nicht überein.');
      return;
    }

    try {
      const userData = {
        username: this.username,
        password: this.password,
        first_name: this.firstname,
        last_name: this.lastname,
        color: this.color,
        email: this.email
      };
      console.log('userData:', userData);

      let response = await this.authService.register(userData);

      this.registrationSuccess = true;
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        console.error('Registrierung fehlgeschlagen mit Status:', e.status);
        console.error('Fehlermeldung:', e.error);
      } else {
        console.error('Ein unerwarteter Fehler ist aufgetreten:', e);
      }
    }
  }
}
