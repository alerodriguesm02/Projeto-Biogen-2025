import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  assets: any;
  private navToggle: HTMLElement | null = null;
  private navMenu: HTMLElement | null = null;
  
  // Propriedades de autenticação
  isAuthenticated = false;
  currentUser: User | null = null;
  private authSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Aguarda o DOM estar pronto
    setTimeout(() => {
      this.initMobileMenu();
    }, 0);

    // Inscrever-se nas mudanças de autenticação
    this.authSubscription.add(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      })
    );

    this.authSubscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    // Remove event listeners para evitar memory leaks
    if (this.navToggle) {
      this.navToggle.removeEventListener('click', this.toggleMobileMenu.bind(this));
    }
    
    // Cancelar inscrições
    this.authSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  private initMobileMenu() {
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');

    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
      
      // Fecha o menu quando clicar em um link
      const navLinks = this.navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', this.closeMobileMenu.bind(this));
      });

      // Fecha o menu quando clicar fora dele
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }

  private toggleMobileMenu() {
    if (this.navToggle && this.navMenu) {
      this.navToggle.classList.toggle('active');
      this.navMenu.classList.toggle('active');
      
      // Previne scroll do body quando menu está aberto
      if (this.navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  private closeMobileMenu() {
    if (this.navToggle && this.navMenu) {
      this.navToggle.classList.remove('active');
      this.navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  private handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (this.navToggle && this.navMenu && 
        !this.navToggle.contains(target) && 
        !this.navMenu.contains(target)) {
      this.closeMobileMenu();
    }
  }
}
