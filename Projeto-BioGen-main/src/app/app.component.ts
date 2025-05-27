import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { BannerComponent } from "./banner/banner.component";
import { SecaoComponent } from "./secao/secao.component";
import { FooterComponent } from "./footer/footer.component";
import { MiniCarroselComponent } from "./mini-carrosel/mini-carrosel.component";
import { BannerCtaComponent } from './banner-cta/banner-cta.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Adicionado aqui para suportar *ngIf
    BannerCtaComponent,
    RouterOutlet,
    HeaderComponent,
    BannerComponent,
    SecaoComponent,
    FooterComponent,
    MiniCarroselComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Projeto-BioGen';

  private synth: SpeechSynthesis | null = null; // Inicializa como null
  private utterance: SpeechSynthesisUtterance | null = null; // Armazena a fala atual
  isReaderMenuOpen = false; // Controla se o menu está aberto ou fechado

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Verifica se está no navegador antes de acessar o objeto window
    if (isPlatformBrowser(this.platformId)) {
      this.synth = window.speechSynthesis; // Inicializa o synth apenas no navegador
    }
  }

  // Alterna o estado do menu de leitura
  toggleReaderMenu(): void {
    this.isReaderMenuOpen = !this.isReaderMenuOpen;
  }

  // Função para iniciar a leitura de toda a página
  readText(): void {
    if (!this.synth) return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const text = document.body.innerText;
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'pt-BR';
    this.synth.speak(this.utterance);
  }

  // Função para ler o texto selecionado
  readSelectedText(): void {
    if (!this.synth) return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const selectedText = window.getSelection()?.toString();
    const text = selectedText ? selectedText : 'Nenhum texto selecionado.';

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'pt-BR';
    this.synth.speak(this.utterance);
  }

  // Função para pausar a leitura
  pauseReading(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  // Função para retomar a leitura
  resumeReading(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  // Função para parar a leitura
  stopReading(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }





}
