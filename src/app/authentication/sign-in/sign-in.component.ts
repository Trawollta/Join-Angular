import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    remember: new FormControl(false)
  });

  constructor(private router: Router, private authService: AuthService) {}

  async onSubmit() {
    if (this.signInForm.valid) {
      const credentials = {
        username: this.signInForm.value.username as string,
        password: this.signInForm.value.password as string
      };
      try {
        await this.authService.login(credentials);
        this.router.navigateByUrl('dashboard/summary');
      } catch (error) {
        // Fehlerbehandlung hinzufügen, z.B. Anzeige einer Fehlermeldung
      }
    }
  }
}
