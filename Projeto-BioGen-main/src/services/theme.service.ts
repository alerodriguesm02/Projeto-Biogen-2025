import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  setTheme(theme: string): void {
    document.body.className = theme;
  }
}
