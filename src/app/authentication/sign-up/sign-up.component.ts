import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  username = '';
  password = '';
  firstname= '';
  lastname= '';
  email= '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    try {
      const userData = {
        username: this.username,
        password: this.password,
        first_name: this.firstname,
        last_name: this.lastname,
        email: this.email
      };
  
      let response = await this.authService.register(userData);
  
      this.router.navigateByUrl('/login');
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        console.error('Registration failed with status:', e.status);
        console.error('Error response:', e.error);
      } else {
        console.error('An unexpected error occurred:', e);
      }
    }
  }
}
