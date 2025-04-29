import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) {
      this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  ngAfterViewInit(): void {
      if (this.authService.isAuthenticated()) {
          this.router.navigate(['login']);
      }
  }
  
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
        this.router.navigate(['login']);
    }
}

  onSubmit(): void {
      if (this.loginForm.valid) {
          this.loading = true;
          this.errorMessage = '';

          const { email, password } = this.loginForm.value;

          this.authService.login(email, password).subscribe({
              next: (user) => {
                  this.loading = false;
                  this.router.navigate(['dashboard']);
              },
              error: (error) => {
                  this.loading = false;
                  this.errorMessage = error.message;
              }
          });
      } else {
          this.loginForm.markAllAsTouched();
      }
  }

  togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
  }

  // Getters para facilitar o acesso no template
  get emailControl() {
      return this.loginForm.get('email');
  }

  get passwordControl() {
      return this.loginForm.get('password');
  }

  get emailErrorMessage(): string {
      if (this.emailControl?.hasError('required')) {
          return 'Email é obrigatório';
      }
      if (this.emailControl?.hasError('email')) {
          return 'Email inválido';
      }
      return '';
  }

  get passwordErrorMessage(): string {
      if (this.passwordControl?.hasError('required')) {
          return 'Senha é obrigatória';
      }
      if (this.passwordControl?.hasError('minlength')) {
          return 'Senha deve ter no mínimo 6 caracteres';
      }
      return '';
  }
}
