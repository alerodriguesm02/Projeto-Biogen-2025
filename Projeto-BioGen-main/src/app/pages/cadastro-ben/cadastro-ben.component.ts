import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cadastro-ben',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './cadastro-ben.component.html',
  styleUrl: './cadastro-ben.component.css'
})
export class CadastroBenComponent implements OnInit {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.cadastroForm = this.fb.group({
      nis: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')
      ]]
    });
  }

  ngOnInit(): void {
    this.setupNISMask();
  }

  onSubmit(): void {
    if (this.cadastroForm.valid && this.validateNIS(this.cadastroForm.get('nis')?.value)) {
      this.authService.registerBeneficiario(this.cadastroForm.value).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso:', response);
          alert('Obrigado por se cadastrar!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          alert('Erro ao realizar cadastro. Por favor, tente novamente.');
        }
      });
    } else {
      this.markFormGroupTouched(this.cadastroForm);
    }
  }

  private validateNIS(nis: string): boolean {
    nis = nis.replace(/[^\d]/g, '');
    return nis.length === 11;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private setupNISMask(): void {
    const nisControl = this.cadastroForm.get('nis');
    if (nisControl) {
      nisControl.valueChanges.subscribe(value => {
        if (!value) return;

        let newValue = value.replace(/\D/g, '');

        if (newValue.length > 11) {
          newValue = newValue.slice(0, 11);
        }

        if (newValue.length <= 11) {
          newValue = newValue.replace(/^(\d{3})(\d)/, '$1.$2');
          newValue = newValue.replace(/^(\d{3})\.(\d{5})(\d)/, '$1.$2.$3');
          newValue = newValue.replace(/\.(\d{5})\.(\d{2})(\d)/, '.$1.$2-$3');
        }

        nisControl.setValue(newValue, { emitEvent: false });
      });
    }
  }

  // Getters para facilitar o acesso no template
  get nisInvalido(): boolean {
    const control = this.cadastroForm.get('nis');
    return control ? (control.invalid && control.touched) ||
           (control.touched && !this.validateNIS(control.value)) : false;
  }

  get emailInvalido(): boolean {
    const control = this.cadastroForm.get('email');
    return control ? control.invalid && control.touched : false;
  }

  get emailErrorMessage(): string {
    const control = this.cadastroForm.get('email');
    if (control) {
      if (control.hasError('required')) {
        return 'Email é obrigatório';
      }
      if (control.hasError('email') || control.hasError('pattern')) {
        return 'Email inválido';
      }
    }
    return '';
  }
}
