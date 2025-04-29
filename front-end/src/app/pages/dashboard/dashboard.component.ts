import { Chart } from 'chart.js/auto';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Remover ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone : true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [ 
  CommonModule, // Importar CommonModule se ainda não estiver
  ReactiveFormsModule, // Adicionar ReactiveFormsModule ao array de imports
  FormsModule,
  ]
})
export class DashboardComponent implements OnInit {
  editarLinha(index: number) {
    const anoSelecionado = this.dataForm.value.ano; // Obter o ano selecionado no formulário
  
    // Preencher o formulário com os dados da linha selecionada
    this.dataForm.patchValue({
      mes: index, // Definir o mês como o índice da linha
      toneladas: this.dadosPorAno[anoSelecionado].toneladas[index] || 0, // Preencher toneladas
      energia: this.dadosPorAno[anoSelecionado].energia[index] || 0, // Preencher energia
      imposto: this.dadosPorAno[anoSelecionado].imposto[index] || 0, // Preencher imposto
    });
  
    this.isModalOpen = true; // Abrir o modal para edição
  }

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

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.dataForm = this.fb.group({
      ano: [2024, Validators.required],
      mes: [0, Validators.required],
      toneladas: [null, [Validators.required, Validators.min(0)]],
      energia: [null, [Validators.required, Validators.min(0)]],
      imposto: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.criarGraficos();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.criarGraficos();
      this.atualizarTabela();
    }
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
    this.lineChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].toneladas;
    this.lineChart.update();
    this.pieChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].energia;
    this.pieChart.update();
    this.barChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].imposto;
    this.barChart.update();
  }

  dadosTabela: any[] = [];

atualizarTabela() {
  const anoSelecionado = this.dataForm.value.ano;
  this.dadosTabela = this.meses.map((mes, index) => ({
    mes,
    toneladas: this.dadosPorAno[anoSelecionado].toneladas[index],
    energia: this.dadosPorAno[anoSelecionado].energia[index],
    imposto: this.dadosPorAno[anoSelecionado].imposto[index],
  }));
}

  aoEnviar() {
    const { ano, mes, toneladas, energia, imposto } = this.dataForm.value;
    this.dadosPorAno[ano].toneladas[mes] = toneladas;
    this.dadosPorAno[ano].energia[mes] = energia;
    this.dadosPorAno[ano].imposto[mes] = imposto;

    this.atualizarGraficos();
    this.dataForm.reset({ ano: ano, mes: mes });
    this.fecharModal();
  }

  abrirModal() {
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }
}
