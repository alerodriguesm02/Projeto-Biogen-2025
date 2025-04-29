import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { BannerComponent } from "./banner/banner.component";
import { SecaoComponent } from "./secao/secao.component";
import { FooterComponent } from "./footer/footer.component";
import { MiniCarroselComponent } from "./mini-carrosel/mini-carrosel.component";
import { BannerCtaComponent } from './banner-cta/banner-cta.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BannerCtaComponent,RouterOutlet, HeaderComponent, BannerComponent, SecaoComponent, FooterComponent, MiniCarroselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Projeto-BioGen';
}
