import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface AddressData {
  logradouro: string;
  erro?: boolean;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})


export class CadastroComponent implements OnInit {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.cadastroForm = this.fb.group({
      cnpj: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.setupInputMasks();
  }

  onSubmit(): void {
    if (this.cadastroForm.valid && this.validateCNPJ(this.cadastroForm.get('cnpj')?.value)) {
      this.authService.registerFornecedor(this.cadastroForm.value).subscribe({
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

  private setupInputMasks(): void {
    // CNPJ Mask
    const cnpjControl = this.cadastroForm.get('cnpj');
    cnpjControl?.valueChanges.subscribe(value => {
      if (!value) return;

      let newValue = value.replace(/\D/g, '');
      if (newValue.length > 14) newValue = newValue.slice(0, 14);

      if (newValue.length <= 14) {
        newValue = newValue.replace(/^(\d{2})(\d)/, '$1.$2');
        newValue = newValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        newValue = newValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
        newValue = newValue.replace(/(\d{4})(\d)/, '$1-$2');
      }

      cnpjControl.setValue(newValue, { emitEvent: false });
    });

    // CEP Mask
    const cepControl = this.cadastroForm.get('cep');
    cepControl?.valueChanges.subscribe(value => {
      if (!value) return;

      let newValue = value.replace(/\D/g, '');
      if (newValue.length > 8) newValue = newValue.slice(0, 8);
      if (newValue.length === 8) {
        newValue = newValue.replace(/^(\d{5})(\d{3})$/, '$1-$2');
      }

      cepControl.setValue(newValue, { emitEvent: false });
    });
  }

  async buscaCEP(): Promise<void> {
    let cep = this.cadastroForm.value.cep;
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data: AddressData = await response.json();
        if (!data.erro) {
          this.cadastroForm.patchValue({
            endereco: data.logradouro
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  }

  validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, '');

    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters para fácil acesso no template
  get cnpjInvalido(): boolean {
    const control = this.cadastroForm.get('cnpj');
    return control ? (control.invalid && control.touched) ||
           (control.touched && !this.validateCNPJ(control.value)) : false;
  }

  get razaoSocialInvalida(): boolean {
    const control = this.cadastroForm.get('razaoSocial');
    return control ? control.invalid && control.touched : false;
  }

  get cepInvalido(): boolean {
    const control = this.cadastroForm.get('cep');
    return control ? control.invalid && control.touched : false;
  }

  get enderecoInvalido(): boolean {
    const control = this.cadastroForm.get('endereco');
    return control ? control.invalid && control.touched : false;
  }

  get numeroInvalido(): boolean {
    const control = this.cadastroForm.get('numero');
    return control ? control.invalid && control.touched : false;
  }

  get emailInvalido(): boolean {
    const control = this.cadastroForm.get('email');
    return control ? control.invalid && control.touched : false;
  }

  get senhaInvalida(): boolean {
    const control = this.cadastroForm.get('senha');
    return control ? control.invalid && control.touched : false;
  }
}

/* SCRIPT */


