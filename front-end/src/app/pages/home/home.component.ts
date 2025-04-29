import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { BannerComponent } from '../../banner/banner.component';
import { MiniCarroselComponent } from '../../mini-carrosel/mini-carrosel.component';
import { BannerCtaComponent } from '../../banner-cta/banner-cta.component';
import { SecaoComponent } from '../../secao/secao.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, MiniCarroselComponent, BannerCtaComponent, SecaoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
