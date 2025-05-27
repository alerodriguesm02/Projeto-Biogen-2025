import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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

  ngOnInit(): void {
      // Verificar se o usuário já está autenticado
      if (this.authService.isAuthenticated()) {
          this.router.navigate(['/dashboard']);
      }
  }

  onSubmit(): void {
      if (this.loginForm.valid) {
          this.loading = true;
          this.errorMessage = '';

          const { email, password } = this.loginForm.value;

          this.authService.login(email, password).subscribe({
              next: (response) => {
                  this.loading = false;
                  console.log('Login bem-sucedido:', response);
                  this.router.navigate(['/dashboard']); // Redireciona após login bem-sucedido
              },
              error: (error) => {
                  this.loading = false;
                  console.error('Erro no login:', error);
                  
                  // Tratar diferentes tipos de erro
                  if (error.status === 401) {
                      this.errorMessage = 'Email ou senha incorretos';
                  } else if (error.status === 500) {
                      this.errorMessage = 'Erro interno do servidor. Tente novamente.';
                  } else {
                      this.errorMessage = 'Erro de conexão. Verifique sua internet.';
                  }
              }
          });
      } else {
          this.loginForm.markAllAsTouched(); // Marca todos os campos como "tocados" para exibir mensagens de erro
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
