import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonComponent } from '../../shared/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements AfterViewInit {
  signUpForm: FormGroup;
  registrationSuccess = false;

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signUpForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      color: ['#ffffff', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngAfterViewInit(): void {
    this.drawInitials();
  }

  passwordValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value || '';
    if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      return { invalidPassword: true };
    }
    return null;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  updateColor(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.signUpForm.patchValue({ color: inputElement.value });
    this.drawInitials();
  }

  drawInitials(): void {
    if (this.canvas) {
      const context = this.canvas.nativeElement.getContext('2d');
      if (context) {
        const { firstname, lastname, color } = this.signUpForm.value;
        context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        context.fillStyle = color;
        context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        context.fillStyle = '#ffffff';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const initials = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
        context.fillText(initials, this.canvas.nativeElement.width / 2, this.canvas.nativeElement.height / 2);
      }
    }
  }

  async onSubmit() {
    if (this.signUpForm.invalid) {
      console.error('Formular ungültig.');
      return;
    }

    try {
      const userData = this.signUpForm.value;
      delete userData.confirmPassword;

      const response = await this.authService.register(userData);

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
