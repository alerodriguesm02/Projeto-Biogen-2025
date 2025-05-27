import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private synth = window.speechSynthesis;

  speak(text: string): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    this.synth.speak(utterance);
  }
}
