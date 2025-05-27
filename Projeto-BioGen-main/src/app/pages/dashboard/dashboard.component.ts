import { Chart } from 'chart.js/auto';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LancamentosService } from '../../../services/lancamento.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dataForm: FormGroup;
  meses: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  anoAtual: number = 2024;
  dadosPorAno: any = {
    2022: this.inicializarDados(),
    2023: this.inicializarDados(),
    2024: this.inicializarDados(),
  };
  lineChart: any;
  pieChart: any;
  barChart: any;
  isModalOpen: boolean = false;
  dadosTabela: any[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private lancamentosService: LancamentosService // Adicionado o serviço
  ) {
    this.dataForm = this.fb.group({
      ano: [2024, Validators.required],
      mes: [0, Validators.required],
      toneladas: [null, [Validators.required, Validators.min(0)]],
      energia: [null, [Validators.required, Validators.min(0)]],
      imposto: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarLancamentos(); // Carrega dados do backend
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.criarGraficos();
    }
  }

  // Novo método para carregar dados do backend
  carregarLancamentos() {
    this.lancamentosService.getLancamentos().subscribe({
      next: (lancamentos) => {
        // Resetar dados
        this.dadosPorAno = {
          2022: this.inicializarDados(),
          2023: this.inicializarDados(),
          2024: this.inicializarDados(),
        };

        // Preencher dados recebidos do backend
        lancamentos.forEach(lancamento => {
          if (this.dadosPorAno[lancamento.ano]) {
            const mesIndex = this.meses.indexOf(lancamento.mes);
            if (mesIndex !== -1) {
              this.dadosPorAno[lancamento.ano].toneladas[mesIndex] = lancamento.toneladasProcessadas;
              this.dadosPorAno[lancamento.ano].energia[mesIndex] = lancamento.energiaGerada;
              this.dadosPorAno[lancamento.ano].imposto[mesIndex] = lancamento.impostoAbatido;
            }
          }
        });

        this.atualizarGraficos();
        this.atualizarTabela();
      },
      error: (error) => console.error('Erro ao carregar lançamentos:', error)
    });
  }

  inicializarDados() {
    return {
      toneladas: Array(12).fill(null),
      energia: Array(12).fill(null),
      imposto: Array(12).fill(null),
    };
  }

  criarGraficos() {
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: this.meses,
        datasets: [{ label: 'Toneladas Processadas (Ton)', data: this.dadosPorAno[this.anoAtual].toneladas, borderColor: 'rgb(255, 99, 132)', tension: 0.1 }],
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } },
    });

    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: this.meses,
        datasets: [{ label: 'KW', data: this.dadosPorAno[this.anoAtual].energia, backgroundColor: this.obterCoresPie() }],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: this.meses,
        datasets: [{ label: 'Imposto Abatido (R$)', data: this.dadosPorAno[this.anoAtual].imposto, backgroundColor: 'rgb(75, 192, 192)' }],
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } },
    });
  }

  obterCoresPie() {
    return ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  }

  aoMudarAno() {
    this.anoAtual = this.dataForm.value.ano;
    this.atualizarGraficos();
    this.atualizarTabela();
  }

  atualizarGraficos() {
    if (this.lineChart && this.pieChart && this.barChart) {
      this.lineChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].toneladas;
      this.lineChart.update();
      this.pieChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].energia;
      this.pieChart.update();
      this.barChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].imposto;
      this.barChart.update();
    }
  }

  atualizarTabela() {
    const anoSelecionado = this.dataForm.value.ano;
    this.dadosTabela = this.meses.map((mes, index) => ({
      mes,
      toneladas: this.dadosPorAno[anoSelecionado].toneladas[index],
      energia: this.dadosPorAno[anoSelecionado].energia[index],
      imposto: this.dadosPorAno[anoSelecionado].imposto[index],
    }));
  }

  // Modificado para usar o serviço
  aoEnviar() {
    if (this.dataForm.valid) {
      const { ano, mes, toneladas, energia, imposto } = this.dataForm.value;

      this.lancamentosService.criarLancamento({
        ano,
        mes: this.meses[mes],
        toneladas,
        energia,
        imposto
      }).subscribe({
        next: (response) => {
          console.log('Lançamento criado:', response);
          this.carregarLancamentos(); // Recarrega os dados do backend
          this.dataForm.reset({ ano, mes });
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao criar lançamento:', error);
          alert('Erro ao salvar os dados. Tente novamente.');
        }
      });
    }
  }

  editarLinha(index: number) {
    const anoSelecionado = this.dataForm.value.ano;
    this.dataForm.patchValue({
      mes: index,
      toneladas: this.dadosPorAno[anoSelecionado].toneladas[index] || 0,
      energia: this.dadosPorAno[anoSelecionado].energia[index] || 0,
      imposto: this.dadosPorAno[anoSelecionado].imposto[index] || 0,
    });
    this.isModalOpen = true;
  }

  abrirModal() {
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }
}
